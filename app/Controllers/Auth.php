<?php namespace App\Controllers;

use \App\Libraries\OAuth;
use \OAuth2\Request;
use \OAuth2\Response;
use CodeIgniter\API\ResponseTrait;
use OAuth2\Encryption\Jwt;

class Auth extends BaseController
{	
	use ResponseTrait;

	
	var $server;
	var $data =[];
// You can get a simple private/public key pair using:
// openssl genrsa 512 >private_key.txt
// openssl rsa -pubout <private_key.txt >public_key.txt

	var $private_key = <<<EOD
-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBANIRt/skm6WCKcW+iBBS7sXnAyynY74hXBE3MRoSc98eaqLzt8Ct
74Jax6IybETUwEpuAKJKQL8F8DuYWkcmu9MCAwEAAQJAJhUyPmRXlzyup/uvnQ37
3YLQz4KVEX3ou/I+g5R+zx7XSqO77Gq0eiFk4QbC4JpNb6O1rKl+OMdfJgFLr+BO
WQIhAPXNGjw+mNFG8+OmTDem5yK8/koOEcaWR4THtHpm3pblAiEA2skSVTdB+zM9
BkcbJgsU2glDjn5Yx1Wtl9TXk+tQZFcCIEjvANfbYxDF0tw7neXteivOlE14+0FH
mhUGBMFFAMsZAiA9nof1TDzfHQ1A6WHyEwjqZ9WJGniym6TqsF2PIaVgvQIhAK3A
BP+TFWjup2DLobhte5YDj9C3wPq/uTID28EMewmt
-----END RSA PRIVATE KEY-----
EOD;

	public function __construct(){

		$locale = service('request')->getLocale();
		$this->data['locale'] = $locale;
		$this->data['base_url'] = base_url();
		$this->data['current_url'] = current_url();
		$this->data['home_url'] = base_url();
 

		$this->data['token_action_url'] = site_url("auth/token");

		$this->data['jwt_action_url'] = site_url("auth/jwt");
		$this->data['redirect_url'] = site_url("{$locale}/robot/");
		$this->data['device_redirect_url'] = site_url("{$locale}/robot/run");
		$this->data['redirect_device_login_error_url'] = site_url("{$locale}/auth/error");
		$this->data['user_login_url'] = site_url("{$locale}/auth/userlogin");
		$this->data['user_login2_url'] = site_url("{$locale}/auth/userlogin2");
		$this->data['userlogin_action_url'] = site_url("auth/userauth");
		$this->data['userlogin2_action_url'] = site_url("auth/userauth2");


	}




	public function cklogin()
	{
		//helper('form');
		if($this->request->getMethod() != 'post')
			return $this->fail('Only post request is allowed');
		
		$json = $this->request->getJSON();

			
		$client_id = $json->email;
		
		$oauth = new OAuth();
		$request = Request::createFromGlobals();
		$response = new Response();

		$request->query['client_id'] = $client_id;
		$request->query['state'] = 'checking';
		$request->query['response_type'] = 'code';

		// validate the authorize request
		if (!$oauth->server->validateAuthorizeRequest($request, $response)) {
			$data =  (array)json_decode($response->getResponseBody());
			$data['client_id'] = $client_id;
			$data['auth_state'] =  'checking';
			return json_encode($data);
			//$response->send();//{"error":"invalid_client","error_description":"The client id supplied is invalid"}
			die();
		}
		
		$data=[];
		$oauth->server->handleAuthorizeRequest($request, $response, true);
		

		$code = substr($response->getHttpHeader('Location'), strpos($response->getHttpHeader('Location'), 'code=')+5, 40);
		if(!empty($code))
		{
			$session = \Config\Services::session();
			$data = [
				'url' =>  substr($response->getHttpHeader('Location'), 0, strpos($response->getHttpHeader('Location'), '?code=')),
				//'full_url' => $response->getHttpHeader('Location'),
				'client_id' => $client_id,
				'auth_state' => 'checkpass',
				'code' => $code
			];
			$session->set(config('Auth')->user_login_session, $data);
		}
		return json_encode($data);
	}

	public function cklogin2()
	{
		if($this->request->getMethod() != 'post')
		return $this->fail('Only post request is allowed');
	
		$json = (array)$this->request->getJSON();

		//client_id=xxxx,client_secret=xxxx, code= token
		$session = \Config\Services::session();

		$obj = $session->get(config('Auth')->user_login_session);
		//var_dump($obj);
		$client_id = $obj['client_id'];
		$client_secret = $json['client_secret'];

		$client = \Config\Services::curlrequest();
		
		$response = $client->request('POST', $this->data['token_action_url'] , [
					'allow_redirects' => true,
					'form_params' => [
							'grant_type' => 'authorization_code',
							'client_id' =>  $client_id,
							'client_secret' => $client_secret,
							'code' => $obj['code']
						]
				]);
				
		$obj =json_decode($response->getBody());
		
		if(property_exists($obj,"access_token" ))
		{
			$obj_arr = (array)$obj;
			$obj_arr['time'] = time();
			$obj_arr['client_id'] = $client_id;

			$sess_obj[config('Auth')->jwt_session]=[];
			$sess_obj[config('Auth')->user_logedin_session] = [
						'object' => $obj_arr,
						'client_secret' => $client_secret,
						'client_id'=>$client_id,
			];
			$session->set(config('Auth')->auth_session, $sess_obj);
			return json_encode((array)$obj_arr);
		}
		
		return json_encode((array)$obj);
	}

	////curl -u TestClient:TestSecret https://api.mysite.com/token -d 'grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA'
	public function refresh()
	{
		$json = (array)$this->request->getJSON();

		//client_id=xxxx,client_secret=xxxx, code= token
		$session = \Config\Services::session();

		$obj = $session->get(config('Auth')->auth_session);
		$user_sess = $obj[config('Auth')->user_logedin_session];

		$client_id = $user_sess['client_id'];
		$client_secret = $user_sess['client_secret'];
		//return json_encode( array($json ,$user_sess  ));

	 	$client = \Config\Services::curlrequest();
		
		$response = $client->request('POST', $this->data['token_action_url'] , [
					'allow_redirects' => true,
					'form_params' => [
							'grant_type' => 'refresh_token',
							'client_id' =>  $client_id,
							'client_secret' => $client_secret,
							'refresh_token' => $json['refresh_token']
						]
				]);
				
		$obj = json_decode($response->getBody());
		if(property_exists($obj,"access_token" ))
		{
			$obj_arr = (array)$obj;
			$obj_arr['time'] = time();
			$obj_arr['client_id'] = $client_id;
			$sess_obj[config('Auth')->jwt_session]=[];
			$sess_obj[config('Auth')->user_logedin_session] = [
						'object' => $obj_arr,
						'client_secret' => $client_secret,
						'client_id'=>$client_id,
			];
			$session->set(config('Auth')->auth_session, $sess_obj);
			return json_encode($obj_arr);

		}else{
			return json_encode( (array)$obj);
		}

		
		
	}

	


	public function error()
	{
		$this->data['page_title_text'] =   lang('Auth.error.page_title'); 
		$this->data['header_title_text'] = lang('Auth.error.header_text'); 

		$this->data['login_caption_text'] =  lang('Auth.error.login_caption_text'); 

		$this->data['client_placeholder'] = lang('Auth.error.client_placeholder');
		$this->data['password_placeholder'] = lang('Auth.error.password_placeholder');
		$this->data['new_login_text'] =  lang('Auth.error.new_login_text');  
		$this->data['err_text_message'] = $this->request->getVar('err');

		$html = view('Auth/error', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}

	///Device login
	public function index()
	{
		
		$this->data['page_title_text'] =   lang('Auth.index.page_title'); 
		$this->data['header_title_text'] = lang('Auth.index.header_text'); 

		$this->data['login_caption_text'] =  lang('Auth.index.login_caption_text'); 

		$this->data['client_placeholder'] = lang('Auth.index.client_placeholder');
		$this->data['password_placeholder'] = lang('Auth.index.password_placeholder');
		$this->data['new_login_text'] =  lang('Auth.index.new_login_text');  
		
		$html = view('Auth/index', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}


	public function userlogin()
	{

		
		$this->data['page_title_text'] =   lang('Auth.userlogin.page_title'); 
		$this->data['header_title_text'] = lang('Auth.userlogin.header_text'); 

		$this->data['login_caption_text'] =  lang('Auth.userlogin.login_caption_text'); 

		$this->data['client_placeholder'] = lang('Auth.userlogin.client_placeholder');
		$this->data['password_placeholder'] = lang('Auth.userlogin.password_placeholder');
		$this->data['new_login_text'] =  lang('Auth.userlogin.new_login_text'); 
		$this->data['error'] = $this->request->getVar('err');
		
		$html = view('Auth/userlogin', $this->data);

		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;

	}


	public function userauth()
	{
		helper('form');
		$err='';
	
		if($this->request->getMethod() != 'post')
			return $this->fail('Only post request is allowed');

		$rules = [
			'username' => 'required|min_length[3]|max_length[20]',
		];
		if(! $this->validate($rules)){

			//var_dump($this->validator->getErrors());

			$html = urlencode($this->validator->getErrors()["username"]);
			$err="?err={$html}";
			$redirect_uri = "{$this->data['user_login_url']}{$err}";
			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
			die();
			//return $this->fail($this->validator->getErrors());
		}


		$client_id = $this->request->getVar('username');
		
			
		$oauth = new OAuth();
		$request = Request::createFromGlobals();
		$response = new Response();

		$request->query['client_id'] = $client_id;
		$request->query['state'] = 'checking';
		$request->query['response_type'] = 'code';

		// validate the authorize request
		if (!$oauth->server->validateAuthorizeRequest($request, $response)) {

			//$response->send();//{"error":"invalid_client","error_description":"The client id supplied is invalid"}
			//var_dump( $response->getResponseBody() );
			$obj =  json_decode($response->getResponseBody());
			//var_dump($obj);
			//object(stdClass)#86 (2) { ["error"]=> string(14) "invalid_client" ["error_description"]=> string(33) "The client id supplied is invalid" }
			

			if(property_exists($obj,"error_description" ))
			{
				$html = urlencode($obj->error_description);
				$err="?err={$html}";
			}
			$redirect_uri = "{$this->data['user_login_url']}{$err}";

			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
			die;
		}

		
		$oauth->server->handleAuthorizeRequest($request, $response, true);
		
		$code = substr($response->getHttpHeader('Location'), strpos($response->getHttpHeader('Location'), 'code=')+5, 40);
		if(!empty($code))
		{
			$session = \Config\Services::session();
			$obj = [
				'client_id' => $client_id,
				'state' => 'checking',
				'code' => $code
			];
			$session->set(config('Auth')->user_login_session, $obj);
		//var_dump( $response->getHttpHeaders() );
		}

		$redirect_uri = $response->getHttpHeader('Location');
		header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));

		die();

	}

	public function userlogin2()
	{
		
		$this->data['page_title_text'] =   lang('Auth.userlogin2.page_title'); 
		$this->data['header_title_text'] = lang('Auth.userlogin2.header_text'); 

		$this->data['login_caption_text'] =  lang('Auth.userlogin2.login_caption_text'); 

		$this->data['client_placeholder'] = lang('Auth.userlogin2.client_placeholder');
		$this->data['password_placeholder'] = lang('Auth.userlogin2.password_placeholder');
		$this->data['new_login_text'] =  lang('Auth.userlogin2.new_login_text'); 
		$this->data['error'] = $this->request->getVar('err');
		
		$html = view('Auth/userlogin2', $this->data);

		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;

	}

	public function userauth2()
	{

		helper('form');
	
		if($this->request->getMethod() != 'post')
			return $this->fail('Only post request is allowed');

		$rules = [
			'password' => 'required|min_length[3]|max_length[20]',
		];
		if(! $this->validate($rules)){

			$html = urlencode($this->validator->getErrors()["password"]);
			$err="?err={$html}";
			$redirect_uri = "{$this->data['user_login2_url']}{$err}";
			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
			die();
		}

		
		//client_id=xxxx,client_secret=xxxx, code= token
		$session = \Config\Services::session();

		$obj = $session->get(config('Auth')->user_login_session);
		//var_dump($obj);
		$client_id = $obj['client_id'];
		$client_secret = $this->request->getVar('password');
		$client = \Config\Services::curlrequest();

		$response = $client->request('POST', $this->data['token_action_url'] , [
			'allow_redirects' => true,

			'form_params' => [
					'grant_type' => 'authorization_code',
					'client_id' =>  $client_id,
					'client_secret' => $client_secret,
					'code' => $obj['code']

				]
		]);
		
		$obj = json_decode($response->getBody());

		//var_dump($obj);
		if(property_exists($obj,"error_description" ))//object(stdClass)#85 (2) { ["error"]=> string(13) "invalid_grant" ["error_description"]=> string(34) "The authorization code has expired" }
		{

			$html = urlencode($obj->error_description);
			$err="?err={$html}";
			$redirect_uri = "{$this->data['user_login_url']}{$err}";
			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
			die();
		}

		//var_dump($obj);
		//object(stdClass)#85 (5) { ["access_token"]=> string(40) "55760c30b00416210ca90c2df0844fa4f53851c0" ["expires_in"]=> int(3600) ["token_type"]=> string(6) "Bearer" ["scope"]=> string(4) "user" ["refresh_token"]=> string(40) "69f921a06bcb4863c5a15e5ccd3e531ed0ff6a8b" }

		if(property_exists($obj,"access_token" ))
		{
			$sess_obj[config('Auth')->jwt_session]=[];
			$sess_obj[config('Auth')->user_logedin_session] = [
				'object' => $obj,
				'client_secret' => $client_secret,
				'client_id'=>$client_id,
			];
			

			
			$session->set(config('Auth')->auth_session, $sess_obj);

			$redirect_uri = $this->data['redirect_url'] ;
			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
			die();
		}
		



	}
 

	//===============================================
	// 1.0  http://192.168.10.209:8080/index.php/auth/get_auth?response_type=code&client_id=testclient&state=xyz
	// result: token 
	// 
	// 2.0 http://192.168.10.209:8080/index.php/auth/token_auth POST client_id=xxxx,client_secret=xxxx, code= token (1.0)
	// 2.1 http://192.168.10.209:8080/index.php/auth/token
	// result: {"access_token":"8230ea90833eff5e82537029ae056cc54b80378a","expires_in":3600,"token_type":"Bearer","scope":null,"refresh_token":"2906cac998f2c431b21cce713a80ed20060a386e"}
	//
	// 3.0 http://192.168.10.209:8080/index.php/auth/resource?access_token=8230ea90833eff5e82537029ae056cc54b80378a
	// result:
	// {"success":true,"message":"You accessed my APIs!"}
	// {"error":"invalid_token","error_description":"The access token provided is invalid"}

	//=========== OR =========================================
	//1.0 http://192.168.10.209:8080/index.php/auth/token_client 
	// result:  {"access_token":"786504580aee5c37543f8e5053cae8aa75ea6857","expires_in":3600,"token_type":"Bearer","scope":null}
	//2.0 http://192.168.10.209:8080/index.php/auth/resource?access_token=786504580aee5c37543f8e5053cae8aa75ea6857

	//========== OR =========================================
	//1.0 

	//==========================================================================================
	// 	Create a Token Controller
	// Next, we will create the Token Controller. This is the URI which returns an OAuth2.0 Token to the client. 
	// Here is an
	// curl -u testclient:testpass http://localhost/token.php -d 'grant_type=client_credentials'
	//===========================================================================================
	//Note: http://localhost/token.php assumes you have the file token.php on your local machine, 
	//and you have set up the “localhost” webhost to point to it. This may vary for your application.

	public function token()
	{
		$oauth = new OAuth();
		// Handle a request for an OAuth2.0 Access Token and send the response to the client
		$oauth->server->handleTokenRequest(Request::createFromGlobals())->send();
	}

	//get_auth?response_type=code&client_id=testclient&state=xyz
	public function get_auth()
	{
		$oauth = new OAuth();
		$request = Request::createFromGlobals();
		$response = new Response();
		// validate the authorize request
		if (!$oauth->server->validateAuthorizeRequest($request, $response)) {
			$response->send();
			die;
		}
		$authorized = $this->request->getVar('authorized');

		$is_authorized = ($authorized==='true');
		$oauth->server->handleAuthorizeRequest($request, $response, $is_authorized);

		if ($is_authorized) {
			//redirect()->to($response->getHttpHeader('Location')); //Not working
			$redirect_uri = $response->getHttpHeader('Location');
			header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
			die();
			// this is only here so that you get to see your code in the cURL request. Otherwise, we'd redirect back to the client
		    //$code = substr($response->getHttpHeader('Location'), strpos($response->getHttpHeader('Location'), 'code=')+5, 40);
			//exit("SUCCESS! Authorization Code: $code");
		}
		$response->send();
	
	}

	public function request()
	{
		$oauth = new OAuth();
		$request = Request::createFromGlobals();
		$response = new Response();
		// validate the authorize request
		if (!$oauth->server->validateAuthorizeRequest($request, $response)) {
			$response->send();
			die;
		}

		$oauth->server->handleAuthorizeRequest($request, $response, false);
		$response->send();//Otherwise, we'd redirect back to the client
	}


	//curl -u testclient:testpass http://localhost/token.php -d 'grant_type=authorization_code&code=YOUR_CODE'
	// Result
	//{"access_token":"b5d04e187a6d2187e64541a1f39022b490290f28","expires_in":3600,"token_type":"Bearer","scope":null,"refresh_token":"0954ae6046338f0f36bb07223b72dcce6a7cedfa"}
	public function token_auth()
	{

		$this->data['page_title_text'] =   lang('Users.lockscreen.page_title'); 
		$this->data['header_title_text'] = lang('Users.lockscreen.header_text'); 

		$this->data['user_name_text'] =  "Get Token authorization_code"; 
		$this->data['password_placeholder'] = lang('Users.password_placeholder');
		$this->data['new_login_text'] =  lang('Users.lockscreen.new_login_text');  
		
		$html = view('Auth/token_authorization', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}




	//return {"access_token":"7bf1fb25c5507c18d8169cdd8acf347ddd2bb062","expires_in":3600,"token_type":"Bearer","scope":null}
	public function token_client()
	{

		$this->data['page_title_text'] =   lang('Users.lockscreen.page_title'); 
		$this->data['header_title_text'] = lang('Users.lockscreen.header_text'); 

		$this->data['user_name_text'] =  "Get Token client_credentials"; 
		$this->data['password_placeholder'] = lang('Users.password_placeholder');
		$this->data['new_login_text'] =  lang('Users.lockscreen.new_login_text');  
		


		$html = view('Auth/token_client', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}



	//curl -u TestClient:TestSecret https://api.mysite.com/token -d 'grant_type=password&username=bshaffer&password=brent123'
	//curl https://api.mysite.com/token -d 'grant_type=password&client_id=TestClient&username=bshaffer&password=brent123'
	
	//============ TEST 1 ==========
	//	curl -u testclient:testpass http://192.168.10.209:8080/index.php/auth/token -d 'grant_type=password&username=piya&password=Pimchankam'
    // {"access_token":"9199475d9261682f4ddb5aaa293525fde3cacf04","expires_in":3600,"token_type":"Bearer","scope":"app","refresh_token":"2aa89a946ae1abd92e918471bc2bd8e750089497"}
	// 

	//================== TEST2 ================================
	//	curl http://192.168.10.209:8080/index.php/auth/token -d 'grant_type=password&client_id=testclient&username=piya&password=Pimchankam&client_secret=testpass'
	//	{"access_token":"929746109a5bc3a8e096e1551c3feca4b7052567","expires_in":3600,"token_type":"Bearer","scope":"app","refresh_token":"236ed1e94a4d829f45155395eaf964b74c30e064"}

	public function token_user()
	{

		$this->data['page_title_text'] =   lang('Users.lockscreen.page_title'); 
		$this->data['header_title_text'] = lang('Users.lockscreen.header_text'); 

		$this->data['user_name_text'] =  "Get Token User"; 
		$this->data['password_placeholder'] = lang('Users.password_placeholder');
		$this->data['new_login_text'] =  lang('Users.lockscreen.new_login_text');  
		


		$html = view('Auth/token_user', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}


 	//curl -u TestClient:TestSecret https://api.mysite.com/token -d 'grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA'
	
	 //{"access_token":"6bd26fc8511c7ff17607aa285dd524245d7eeebf","expires_in":3600,"token_type":"Bearer","scope":"app","refresh_token":"ca98b168ebff9da1641b508688cd820a9500446e"}
	 public function token_refresh()
	{
		$this->data['page_title_text'] =   lang('Users.lockscreen.page_title'); 
		$this->data['header_title_text'] = lang('Users.lockscreen.header_text'); 

		$this->data['user_name_text'] =  "Get Token Refresh"; 
		$this->data['password_placeholder'] = lang('Users.password_placeholder');
		$this->data['new_login_text'] =  lang('Users.lockscreen.new_login_text');  
		
		$html = view('Auth/token_refresh', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}


	public function token_jwt()
	{
		
		$this->data['page_title_text'] =   lang('Users.lockscreen.page_title'); 
		$this->data['header_title_text'] = lang('Users.lockscreen.header_text'); 

		$this->data['user_name_text'] =  "Get Token JWT"; 
		$this->data['password_placeholder'] = lang('Users.password_placeholder');
		$this->data['new_login_text'] =  lang('Users.lockscreen.new_login_text');  
		
		$html = view('Auth/token_jwt', $this->data);


		$html = $this->parser->setData($this->data)
             ->renderString($html);

		return  $html ;
	}

	public function jwt()
	{
		helper('form');

		$data = [];

		if($this->request->getMethod() != 'post')
			return $this->fail('Only post request is allowed');

		$rules = [
			'client_id' => 'required|min_length[3]|max_length[20]',
			'subject' => 'required|min_length[3]|max_length[20]',
		];

		if(! $this->validate($rules)){
			return $this->fail($this->validator->getErrors());
		}else{
		
			$client_id = $this->request->getVar('client_id');
			$user_id = $this->request->getVar('subject');

			$grant_type  = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
			$audience =$this->data['token_action_url'] ;
	
			$jwt = $this->generateJWT($this->private_key, $client_id, $user_id, $audience);
			
			//passthru("curl $audience -d 'grant_type=$grant_type&assertion=$jwt'");

			$client = \Config\Services::curlrequest();

			$response = $client->request('POST', $audience , [
				'allow_redirects' => true,

				'form_params' => [
						'grant_type' => $grant_type,
						'assertion' => $jwt
					]
			]);
			
			$obj = json_decode($response->getBody());
			// object(stdClass)#73 (4) {
			// 	["access_token"]=>
			// 	string(40) "abcc9abc433760a6b4caae3613d7c0ea18b5c7bb"
			// 	["expires_in"]=>
			// 	int(3600)
			// 	["token_type"]=>
			// 	string(6) "Bearer"
			// 	["scope"]=>
			// 	string(3) "app"
			//   }
	
		
			if(property_exists($obj,"access_token" ))
			{
				//print_r($obj->access_token);
				
				$session = \Config\Services::session();

				$sess_obj[config('Auth')->user_logedin_session]=[];
				$sess_obj[config('Auth')->jwt_session] = [
				'object' => $obj,
				'client_id'=>$client_id,
				'subject' => $user_id,

			];
			
			$session->set(config('Auth')->auth_session, $sess_obj);


				return json_encode([ 'url' => $this->data['device_redirect_url']  ] );
				//return json_encode([ 'url' => $this->data['redirect_url']."?access_token={$obj->access_token}"  ] );

			}else if(property_exists($obj,"error_description"))
			{
				// 
				// $err="?err={$html}";
				// $redirect_uri = "{$this->data['user_login_url']}{$err}";
				// header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
				// die();
				$html = urlencode($obj->error_description);

				$url = "{$this->data['redirect_device_login_error_url']}?err={$html}";

				return json_encode([ 'url' => $url ] );

			}
			else{

				return json_encode([ 'url' => $this->data['redirect_device_login_error_url']  ] );

			}

			return var_dump($obj );
			
		}	
	}


// You can get a simple private/public key pair using:
// openssl genrsa 512 >private_key.txt
// openssl rsa -pubout <private_key.txt >public_key.txt

	public function test()
	{
		//$private_key = file_get_contents('/home/piya/public_html/robot_common/dev01/jwt-key');
 
		$client_id   = 'TestClient';
		// $user_id     = 'User1';
		$user_id     = 'ist_tablet';
		$grant_type  = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
		$audience = $this->data['token_action_url'] ;

		$jwt = $this->generateJWT($this->private_key, $client_id, $user_id, $audience);
		 
		passthru("curl $audience -d 'grant_type=$grant_type&assertion=$jwt'");

	}


    /**
	 * Generate a JWT
	 *
	 * @param $privateKey The private key to use to sign the token
	 * @param $iss The issuer, usually the client_id
	 * @param $sub The subject, usually a user_id
	 * @param $aud The audience, usually the URI for the oauth server
	 * @param $exp The expiration date. If the current time is greater than the exp, the JWT is invalid
	 * @param $nbf The "not before" time. If the current time is less than the nbf, the JWT is invalid
	 * @param $jti The "jwt token identifier", or nonce for this JWT
	 *
	 * @return string
	 */
	private function generateJWT($privateKey, $iss, $sub, $aud, $exp = null, $nbf = null, $jti = null)
	{
		if (!$exp) {
			$exp = time() + 1000;
		}

		$params = array(
			'iss' => $iss,
			'sub' => $sub,
			'aud' => $aud,
			'exp' => $exp,
			'iat' => time(),
		);

		if ($nbf) {
			$params['nbf'] = $nbf;
		}

		if ($jti) {
			$params['jti'] = $jti;
		}

		$jwtUtil = new Jwt();

		return $jwtUtil->encode($params, $privateKey, 'RS256');
    }


	//Create a Resource Controller
	//Now that you are creating tokens, you’ll want to validate them in your APIs.
	//Here is an example of a resource controller in the file resource:
	//Now run the following from the command line
	//curl http://localhost/resource.php -d 'access_token=YOUR_TOKEN'
	//resource?access_token=702b4f1d6b39628c62204b88bd4915a0427fba7a
	//Results:{"success":true,"message":"You accessed my APIs!"}
	public function resource()
	{
		$oauth = new OAuth();
		// Handle a request to a resource and authenticate the access token
		if (!$oauth->server->verifyResourceRequest(Request::createFromGlobals())) {
			$oauth->server->getResponse()->send();
			die;
		}

		echo json_encode(array('success' => true, 'message' => 'You accessed my APIs!'));
		//Access re4source here

	}







}

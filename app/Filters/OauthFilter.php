<?php namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;

use \App\Libraries\OAuth;
use \OAuth2\Request;
use \OAuth2\Response;


class OauthFilter implements FilterInterface
{

    protected $token;

    public function before(RequestInterface $rst)
    {
      $oauth = new OAuth();
      $request = Request::createFromGlobals();
      $response = new Response();
      $session = \Config\Services::session();
    
      // $access_token =  $rst->getVar('access_token');
      // if(empty($access_token))
      // {
      //   $session = \Config\Services::session();
      //   if($session->has(config('Auth')->jwt_session))
      //   {
      //     $obj = $session->get(config('Auth')->jwt_session);
          
      //     if(isset($obj ))
      //       $request->query['access_token'] = $obj->access_token;
      //   }
      //   else if($session->has(config('Auth')->user_logedin_session))
      //   {
      //     $obj = $session->get(config('Auth')->user_logedin_session);
          
      //     if(isset($obj ))
      //       $request->query['access_token'] = $obj['object']->access_token;
      //   }
      // }



      if($session->has(config('Auth')->auth_session))
      {
        $auth_session = $session->get(config('Auth')->auth_session);
        //var_dump($auth_session);
        if(count($auth_session[config('Auth')->jwt_session]))
        {
          // var_dump($auth_session);
          // array(2) {
          //   ["user_logedin_session"]=&gt;
          //   array(0) {
          //   }
          //   ["access_token_jwt"]=&gt;
          //   array(3) {
          //     ["object"]=&gt;
          //     object(stdClass)#82 (4) {
          //       ["access_token"]=&gt;
          //       string(40) "7c00b1f60d653106e0dd18a780d25e2acde994d6"
          //       ["expires_in"]=&gt;
          //       int(3600)
          //       ["token_type"]=&gt;
          //       string(6) "Bearer"
          //       ["scope"]=&gt;
          //       string(4) "user"
          //     }
          //     ["client_id"]=&gt;
          //     string(10) "3270647482"
          //     ["subject"]=&gt;
          //     string(7) "Android"
          //   }
          // }
          $obj = $auth_session[config('Auth')->jwt_session]["object"];
          if(isset($obj))
          {
            $request->query['access_token'] = $obj->access_token;
          }


        }else if(count($auth_session[config('Auth')->user_logedin_session]))
        {
          //var_dump($auth_session["user_logedin_session"]);
          //   array(2) 
          //   { 
          //     ["access_token_jwt"]=> array(0) 
          //      { 
          //      } 
          //     ["user_logedin_session"]=> array(3) 
          //     { ["object"]=> object(stdClass)#78 (5) 
          //       { ["access_token"]=> string(40) "3871f664ca0891c4b76bcb15b83124415d3dc1aa" 
          //         ["expires_in"]=> int(3600) 
          //         ["token_type"]=> string(6) "Bearer" 
          //         ["scope"]=> string(4) "user" 
          //         ["refresh_token"]=> string(40) "28e47e9193e569fd5ed3bd6dbb72cba93aec6b54" 
          //       } 
          //       ["client_secret"]=> string(12) "Pimchankam04" 
          //       ["client_id"]=> string(4) "Piya" 
          //     } 
          // }          
          $obj = $auth_session[config('Auth')->user_logedin_session]["object"];
          if(isset($obj))
          {
            $request->query['access_token'] = $obj->access_token;
          }
        }
        
      }


      
      if(!$oauth->server->verifyResourceRequest($request)){


       
        $obj = [
          'last_request_url' => current_url()
        ];
        $session->set(config('Auth')->user_request_url_session, $obj);

        if($session->has(config('Auth')->auth_session))
        {
          $auth_session = $session->get(config('Auth')->auth_session);

          if(count($auth_session[config('Auth')->jwt_session]))
          {
            // var_dump($auth_session);
            // die();
            $redirect_uri = site_url("auth/index");
            header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
            die();

          }else if(count($auth_session[config('Auth')->user_logedin_session]))
          {
            //var_dump($auth_session["user_logedin_session"]);
            $obj = $auth_session[config('Auth')->user_logedin_session]["object"];
            if(isset($obj))
            {
              // var_dump($auth_session["user_logedin_session"]);
              // die();
                //$obj->refresh_token;
                //curl -u TestClient:TestSecret https://api.mysite.com/token -d 'grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA'
                $client = \Config\Services::curlrequest();

                $response = $client->request('POST', site_url("auth/token") , [
                  'allow_redirects' => true,
            
                  'form_params' => [
                      'grant_type' => 'refresh_token',
                      'client_id' =>  $auth_session[config('Auth')->user_logedin_session]["client_id"],
                      'client_secret' => $auth_session[config('Auth')->user_logedin_session]["client_secret"],
                      'refresh_token' => $obj->refresh_token,
            
                    ]
                ]);
                
                $obj_response = json_decode($response->getBody());
                var_dump($obj_response);
            }
            
          }


        }

        die();
        // //curl -u TestClient:TestSecret https://api.mysite.com/token -d 'grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA'

        // if($session->has(config('Auth')->jwt_session))
        // {
        //   $obj = $session->get(config('Auth')->jwt_session);
          
        //   if(isset($obj))
        //   {
        //     //$request->query['access_token'] = $obj->access_token;
        //   }
        //   print_r("jwt_session");
        //   var_dump($obj);
        //   $redirect_uri = site_url("auth/index");
        //   // //redirect()->to($redirect_uri);  //not working ! 
        //    //header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
        //   die();
        // }
        // else if($session->has(config('Auth')->user_logedin_session))
        // {
        //   $obj = $session->get(config('Auth')->user_logedin_session);
          
        //   if(isset($obj ))
        //   {
        //     //$request->query['access_token'] = $obj->access_token;
        //     $client = \Config\Services::curlrequest();
        //     //print_r($obj['object']);//stdClass Object ( [access_token] => fc8a2143da007138c8e5a0ddf3fffcf8ea0e523c [expires_in] => 3600 [token_type] => Bearer [scope] => user [refresh_token] => 8e785ba42a7104db86d1954d45481175a047be38 )
        //     $response = $client->request('POST', site_url("auth/token"), [
        //       'allow_redirects' => true,
        
        //       'form_params' => [
        //           'grant_type' => 'refresh_token',
        //           'client_id' =>  $obj['client_id'],
        //           'client_secret' => $obj['client_secret'],
        //           'refresh_token' => $obj['object']->refresh_token,
        //         ]
        //     ]);
            
        //     $obj = json_decode($response->getBody());
        //     var_dump($obj);

        //   }
        //   print_r("user_logedin_session");
        //   die();

        // }

        $redirect_uri = site_url("auth/userlogin");
        //redirect()->to($redirect_uri);  //not working ! 
        header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
        //print_r("No SESSION");
        die();
      }





    }

    //--------------------------------------------------------------------

    public function after(RequestInterface $request, ResponseInterface $response)
    {
      // Do something here
 
    }
}

<?php namespace App\Libraries;

use \App\Libraries\CustomOauthStorage;
use OAuth2\Server as OAuth2Server;
use OAuth2\Storage\Pdo;
use OAuth2\Storage\Memory;
use OAuth2\OpenID\GrantType\AuthorizationCode;
use OAuth2\GrantType\ClientCredentials;
use OAuth2\GrantType\UserCredentials;
use OAuth2\GrantType\RefreshToken;
use OAuth2\GrantType\JwtBearer;
use OAuth2\Encryption\Jwt;


class OAuth
{
    var $server;

    public function __construct(){
        $this->init();
    } 

    public function init()
    {
        $dsn = getenv('database.oauth.DSN');
        $username = getenv('database.oauth.username');
        $password = getenv('database.oauth.password');

        $storage = new Pdo(['dsn' => $dsn, 'username' => $username, 'password' => $password]);

        $this->server = new \OAuth2\Server($storage, array(
            'always_issue_new_refresh_token' => true,
            'refresh_token_lifetime'         => 2419200,
        ));
        

       


        $this->server->addGrantType(new \OAuth2\GrantType\UserCredentials($storage));
        
        // Add the "Client Credentials" grant type (it is the simplest of the grant types)
        $this->server->addGrantType(new \OAuth2\GrantType\ClientCredentials($storage), array(
            'allow_credentials_in_request_body' => false
        ));
        // Add the "Authorization Code" grant type (this is where the oauth magic happens)
        $this->server->addGrantType(new \OAuth2\GrantType\AuthorizationCode($storage));


        $this->server->addGrantType(new \OAuth2\GrantType\RefreshToken($storage, array(
            'always_issue_new_refresh_token' => true,
         )
        ));

        
// You can get a simple private/public key pair using:
// openssl genrsa 512 >private_key.txt
// openssl rsa -pubout <private_key.txt >public_key.txt

        //specify your audience (typically, the URI of the oauth server)

        $audience = site_url("auth/token");

        // create the grant type
        $grantType = new JwtBearer($storage, $audience);

        // add the grant type to your OAuth server
        $this->server->addGrantType($grantType);

//
//===== MANUAL FILE =======
//
        // load public key from keystore
        //$public_key = file_get_contents('/home/piya/public_html/robot_common/dev01/jwt-key.pub');
//         $public_key = <<<EOD
// -----BEGIN PUBLIC KEY-----
// MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANIRt/skm6WCKcW+iBBS7sXnAyynY74h
// XBE3MRoSc98eaqLzt8Ct74Jax6IybETUwEpuAKJKQL8F8DuYWkcmu9MCAwEAAQ==
// -----END PUBLIC KEY-----
// EOD;

        // // assign the public key to a client and user
        // $clientKeys = array('TestClient' => array('subject' => 'User1', 'key' => $public_key));

        // // create a storage object
        // $mem_storage = new Memory(array('jwt' => $clientKeys));

        // // specify your audience (typically, the URI of the oauth server)
        // $audience = site_url("auth/token");

        // // create the grant type
        // $grantType = new JwtBearer($mem_storage, $audience);

        // // add the grant type to your OAuth server
        // $this->server->addGrantType($grantType);




    }

    public function jwt_decode($client_id   = 'TestClient',$user_id     = 'User1' ) : string
    {

        $private_key = file_get_contents('id_rsa');
        // $grant_type  = 'urn:ietf:params:oauth:grant-type:jwt-bearer';
        $audience = site_url("auth/token");

        $jwt = generateJWT($private_key, $client_id, $user_id, $audience);

        //passthru("curl https://api.mysite.com/token -d 'grant_type=$grant_type&assertion=$jwt'");
        return $jwt;
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
	public function generateJWT($privateKey, $iss, $sub, $aud, $exp = null, $nbf = null, $jti = null)
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
    

}
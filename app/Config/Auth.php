<?php namespace Config;

use CodeIgniter\Config\BaseConfig;

class Auth extends BaseConfig
{
    public $auth_session = 'auth_session_object_name';
    public $jwt_session = 'access_token_jwt';
    public $client_session = 'auth_client_session';
    public $user_login_session = 'user_login_session';
    public $user_logedin_session = 'user_logedin_session';
    public $user_request_url_session = 'user_request_url_session';


}
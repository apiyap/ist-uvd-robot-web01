<?php namespace App\Controllers;

use CodeIgniter\API\ResponseTrait;

class User extends BaseController
{
    use ResponseTrait;
    public function __construct(){
        $locale = service('request')->getLocale();
    }

	public function get_session()
	{
		$session = \Config\Services::session();
		$sess = $session->get(config('Auth')->auth_session);
		return json_encode($sess['user_logedin_session']['object']);
    }
    
    public function logout()
    {
        $session = \Config\Services::session();
        $session->remove(config('Auth')->auth_session);
        return json_encode(['logout'=>'sucsess']);
    }

 

	//--------------------------------------------------------------------

}

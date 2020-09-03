<?php namespace App\Controllers;

class Debug extends BaseController
{
	public function index()
	{
        echo "Hi";
        
	}

    public function testpost()
	{
        //$request = \Config\Services::request();
       
        $json = $this->request->getJSON();

        $data =[
            'test'=>'ererwr',
            'test2' => 'sad8798',
            'email' => $this->request->getVar('email') ,
            'is_ajax' => $this->request->isAJAX(),
            'method' => $this->request->getMethod(),
            'json' => $json,

        ];
        return json_encode($data);
        //return json_encode($_POST);

        // $redirect_uri = base_url('/debug/result?' + json_encode($_POST));
		// header('Location: ' . filter_var($redirect_uri, FILTER_SANITIZE_URL));
		// die();
    }

    public function result()
    {
       
    }
    
	//--------------------------------------------------------------------

}

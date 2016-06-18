<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Contracts\Routing\ResponseFactory;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Middleware\GetUserFromToken;

class CustomGeuUserFromToken extends GetUserFromToken
{
    public function __construct(ResponseFactory $response, Dispatcher $events, JWTAuth $auth)
    {
        parent::__construct($response, $events, $auth);
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($request->headers->has('authorization') || $request->query->get('token')){
            //look for it on the headers or on query string
            if (! $token = $this->auth->setRequest($request)->getToken()) {

                if ($request->isXmlHttpRequest()){
                    return $this->respond('tymon.jwt.absent', 'token_not_provided', 400);
                } else {
                    //redirect to login
                    return redirect('/login');
                }
            }

        } else {
            //look for it on a cookie
            if ($request->cookies->has('token') && $request->cookies->get('token')){
                $this->auth->setToken($request->cookies->get('token'));
                $token = $this->auth->getToken();
            } else {
                $token = null;
            }
        }

        try {
            
            $user = $this->auth->authenticate($token);
            
        } catch (TokenExpiredException $e) {
            if ($request->isXmlHttpRequest()){
                return $this->respond('tymon.jwt.expired', 'token_expired', $e->getStatusCode(), [$e]);
            } else {
                \Session::flash('error', 'Su sesión ha expirado. Vuelva a iniciar sesión');
                //redirect to login
                return redirect('/login');
            }
        } catch (JWTException $e) {

            if ($request->isXmlHttpRequest()){
                return $this->respond('tymon.jwt.invalid', 'token_invalid', $e->getStatusCode(), [$e]);
            } else {
                \Session::flash('error', 'Sesión inválida. Vuelva a iniciar sesión');
                //redirect to login
                return redirect('/login');
            }

        }

        if (! $user) {

            if ($request->isXmlHttpRequest()){
                return $this->respond('tymon.jwt.user_not_found', 'user_not_found', 404);
            } else {
                \Session::flash('error', 'No podemos identificar un usuario mediante su sesión, vuelva a iniciarla por favor.');
                return redirect('/login');
            }


        }

        $this->events->fire('tymon.jwt.valid', $user);

        return $next($request);
    }
}

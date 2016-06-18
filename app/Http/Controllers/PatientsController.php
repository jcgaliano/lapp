<?php

namespace App\Http\Controllers;

use App\Patient;
use Illuminate\Http\Request;

use App\Http\Requests;

class PatientsController extends Controller
{

    public function allAction(Request $request){

        $patients = Patient::allPatients();

        $result = [];

        foreach($patients as $p){
            $result[] = $p->toArray();
        }

        return response()->json(['status' => 'success', 'data' => $result]);

    }

}

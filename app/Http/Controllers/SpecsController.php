<?php

namespace App\Http\Controllers;

use App\Specialty;
use Illuminate\Http\Request;

use App\Http\Requests;

class SpecsController extends Controller
{
    public function allAction(){

        $specs = Specialty::all()->toArray();

        return response()->json(['status' => 'success', 'specs' => $specs]);

    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TaskList;

class ListController extends Controller
{
    public function index()
    {
        return response()->json(TaskList::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $list = TaskList::create([
            'name' => $request->name
        ]);

        return response()->json($list, 201);
    }
}

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

    public function show($id)
    {
        $list = TaskList::findOrFail($id);
        return response()->json($list);
    }

    public function update(Request $request, $id)
    {
        $list = TaskList::findOrFail($id);
        
        $request->validate([
            'name' => 'required|string|max:255'
        ]);
        
        $list->update([
            'name' => $request->name
        ]);
        
        return response()->json($list);
    }

    public function destroy($id)
    {
        $list = TaskList::findOrFail($id);
        
        $list->tasks()->delete();
        
        $list->delete();
        
        return response()->json(null, 204);
    }
}

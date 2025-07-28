<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $listId = $request->query('list_id');
        
        if ($listId) {
            $tasks = Task::where('list_id', $listId)->with('list')->get();
        } else {
            $tasks = Task::with('list')->get();
        }
        
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'list_id' => 'required|exists:task_lists,id',
            'completed' => 'boolean'
        ]);

        $task = Task::create([
            'title' => $request->title,
            'list_id' => $request->list_id,
            'completed' => $request->completed ?? false,
        ]);
        
        $task->load('list');
        
        return response()->json($task, 201);
    }

    public function show($id)
    {
        $task = Task::with('list')->findOrFail($id);
        return response()->json($task);
    }

    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'list_id' => 'sometimes|required|exists:task_lists,id',
            'completed' => 'boolean'
        ]);

        $task->update($request->only(['title', 'list_id', 'completed']));
        $task->load('list');
        
        return response()->json($task);
    }
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        
        return response()->json(null, 204);
    }

    public function toggle($id)
    {
        $task = Task::findOrFail($id);
        $task->completed = !$task->completed;
        $task->save();
        $task->load('list');

        return response()->json($task);
    }

    public function getByList($listId)
    {
        $list = TaskList::findOrFail($listId);
        $tasks = $list->tasks;

        return response()->json($tasks);
    }
}

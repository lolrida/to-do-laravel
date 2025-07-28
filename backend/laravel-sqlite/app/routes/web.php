<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\ListController;

Route::get('/tasks', [TaskController::class, 'index']);
Route::post('/tasks', [TaskController::class, 'store']);
Route::get('/tasks/{id}', [TaskController::class, 'show']);
Route::put('/tasks/{id}', [TaskController::class, 'update']);
Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
Route::patch('/tasks/{id}/toggle', [TaskController::class, 'toggle']);

Route::get('/lists', [ListController::class, 'index']);
Route::post('/lists', [ListController::class, 'store']);
Route::get('/lists/{id}', [ListController::class, 'show']);
Route::put('/lists/{id}', [ListController::class, 'update']);
Route::delete('/lists/{id}', [ListController::class, 'destroy']);
Route::get('/lists/{id}/tasks', [TaskController::class, 'getByList']);

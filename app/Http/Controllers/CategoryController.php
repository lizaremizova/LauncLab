<?php

namespace App\Http\Controllers;

use App\Repositories\CategoryRepository;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private CategoryRepository $categoryRepository
    ) {}

    public function index(): JsonResponse
    {
        $categories = $this->categoryRepository->getAllCategories();
        return response()->json($categories);
    }
}

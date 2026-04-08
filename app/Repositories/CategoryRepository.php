<?php

namespace App\Repositories;

use Illuminate\Support\Facades\DB;

class CategoryRepository
{
    public function getAllCategories()
    {
        return DB::table('categories')
            ->select('category_id as id', 'name')
            ->get();
    }
}

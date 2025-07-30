<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'category' => fake()->randomElement(['news', 'review', 'podcast', 'opinion', 'lifestyle']),
            'is_featured' => fake()->boolean(20), // 20% chance of being featured
            'image' => null,
            'views' => fake()->numberBetween(0, 1000),
        ];
    }

    /**
     * Indicate that the post is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the post has an image.
     */
    public function withImage(): static
    {
        return $this->state(fn (array $attributes) => [
            'image' => 'posts/' . fake()->uuid() . '.jpg',
        ]);
    }

    /**
     * Indicate that the post has high views.
     */
    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'views' => fake()->numberBetween(500, 2000),
        ]);
    }

    /**
     * Create a post with a specific category.
     */
    public function category(string $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => $category,
        ]);
    }
}

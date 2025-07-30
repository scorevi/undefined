<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (admin) to assign posts to
        $user = User::first();

        if (!$user) {
            // Create a user if none exists
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]);
        }

        $posts = [
            [
                'title' => 'Welcome to Our Blog',
                'content' => 'This is the first post on our blog. We\'re excited to share our thoughts and ideas with you. Stay tuned for more interesting content! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                'category' => 'General',
                'views' => 125,
            ],
            [
                'title' => 'Getting Started with Laravel',
                'content' => 'Laravel is a powerful PHP framework that makes web development a breeze. In this post, we\'ll explore the basics of Laravel and how to build amazing applications with it. From routing to Eloquent ORM, Laravel provides all the tools you need.',
                'category' => 'Technology',
                'views' => 242,
            ],
            [
                'title' => 'The Future of Web Development',
                'content' => 'Web development is constantly evolving. From new frameworks to innovative design patterns, let\'s explore what the future holds for web developers. We\'ll discuss emerging technologies and trends that are shaping the industry.',
                'category' => 'Technology',
                'views' => 188,
            ],
            [
                'title' => 'Building Responsive Designs',
                'content' => 'Creating websites that look great on all devices is crucial in today\'s mobile-first world. Learn the best practices for responsive web design, including CSS Grid, Flexbox, and media queries.',
                'category' => 'Design',
                'views' => 156,
            ],
            [
                'title' => 'JavaScript Best Practices',
                'content' => 'Writing clean, maintainable JavaScript code is essential for any web developer. Here are some best practices to follow in your next project, including ES6+ features, async/await, and proper error handling.',
                'category' => 'Technology',
                'views' => 298,
            ],
            [
                'title' => 'Modern CSS Techniques',
                'content' => 'Explore the latest CSS features and techniques that can improve your web development workflow. From CSS custom properties to container queries, modern CSS offers powerful tools for styling.',
                'category' => 'Design',
                'views' => 167,
            ],
        ];

        foreach ($posts as $postData) {
            Post::create([
                'user_id' => $user->id,
                'title' => $postData['title'],
                'content' => $postData['content'],
                'category' => $postData['category'],
                'views' => $postData['views'],
                'created_at' => now()->subDays(rand(1, 30)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }
    }
}

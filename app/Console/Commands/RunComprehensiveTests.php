<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class RunComprehensiveTests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:comprehensive {--coverage : Generate code coverage report}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run comprehensive tests for the entire application';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting Comprehensive Test Suite...');
        $this->newLine();

        // Test categories with their descriptions
        $testCategories = [
            'Authentication' => 'User and Admin authentication flows',
            'Posts' => 'Post creation, reading, updating, and deletion',
            'Comments' => 'Comment functionality and permissions',
            'Likes' => 'Like/Unlike functionality',
            'Admin' => 'Administrative functions and settings',
            'Database' => 'Database integrity and relationships',
            'Application' => 'Overall application integrity'
        ];

        $results = [];
        $totalTests = 0;
        $totalFailures = 0;

        foreach ($testCategories as $category => $description) {
            $this->info("📋 Testing: {$category}");
            $this->line("   {$description}");

            $testClass = "Tests\\Feature\\{$category}Test";

            // Run the specific test class
            $command = ['vendor/bin/phpunit', '--testdox', '--filter', $testClass];

            if ($this->option('coverage')) {
                $command[] = '--coverage-text';
            }

            $result = Process::run(implode(' ', $command));

            // Parse the result
            $output = $result->output();
            $passed = $result->successful();

            // Extract test count from output
            preg_match('/(\d+) test/', $output, $matches);
            $testCount = isset($matches[1]) ? (int)$matches[1] : 0;

            preg_match('/(\d+) failure/', $output, $failureMatches);
            $failures = isset($failureMatches[1]) ? (int)$failureMatches[1] : 0;

            $results[$category] = [
                'passed' => $passed,
                'tests' => $testCount,
                'failures' => $failures,
                'output' => $output
            ];

            $totalTests += $testCount;
            $totalFailures += $failures;

            if ($passed) {
                $this->info("   ✅ {$testCount} tests passed");
            } else {
                $this->error("   ❌ {$failures} of {$testCount} tests failed");
            }

            $this->newLine();
        }

        // Generate comprehensive report
        $this->generateReport($results, $totalTests, $totalFailures);

        // Run additional checks
        $this->runAdditionalChecks();

        return $totalFailures > 0 ? 1 : 0;
    }

    private function generateReport(array $results, int $totalTests, int $totalFailures)
    {
        $this->info('📊 TEST RESULTS SUMMARY');
        $this->info('========================');
        $this->newLine();

        foreach ($results as $category => $result) {
            $icon = $result['passed'] ? '✅' : '❌';
            $status = $result['passed'] ? 'PASSED' : 'FAILED';

            $this->line("{$icon} {$category}: {$status} ({$result['tests']} tests)");

            if (!$result['passed'] && $result['failures'] > 0) {
                $this->error("   → {$result['failures']} failure(s)");
            }
        }

        $this->newLine();
        $this->info("OVERALL RESULTS:");
        $this->info("Total Tests: {$totalTests}");
        $this->info("Passed: " . ($totalTests - $totalFailures));
        $this->info("Failed: {$totalFailures}");

        $successRate = $totalTests > 0 ? round((($totalTests - $totalFailures) / $totalTests) * 100, 2) : 0;
        $this->info("Success Rate: {$successRate}%");

        if ($totalFailures === 0) {
            $this->info('🎉 ALL TESTS PASSED! Your application is working flawlessly!');
        } else {
            $this->error('⚠️  Some tests failed. Please review the output above for details.');
        }
    }

    private function runAdditionalChecks()
    {
        $this->newLine();
        $this->info('🔍 ADDITIONAL SYSTEM CHECKS');
        $this->info('============================');

        // Check if all required files exist
        $requiredFiles = [
            'app/Models/User.php',
            'app/Models/Post.php',
            'app/Models/Comment.php',
            'app/Models/Like.php',
            'database/migrations/0001_01_01_000000_create_users_table.php',
            'routes/api.php',
            'routes/web.php'
        ];

        $missingFiles = [];
        foreach ($requiredFiles as $file) {
            if (!file_exists(base_path($file))) {
                $missingFiles[] = $file;
            }
        }

        if (empty($missingFiles)) {
            $this->info('✅ All required files present');
        } else {
            $this->error('❌ Missing required files:');
            foreach ($missingFiles as $file) {
                $this->error("   → {$file}");
            }
        }

        // Check environment configuration
        $envChecks = [
            'APP_KEY' => env('APP_KEY'),
            'DB_CONNECTION' => env('DB_CONNECTION'),
            'APP_ENV' => env('APP_ENV')
        ];

        $envIssues = [];
        foreach ($envChecks as $key => $value) {
            if (empty($value)) {
                $envIssues[] = $key;
            }
        }

        if (empty($envIssues)) {
            $this->info('✅ Environment configuration valid');
        } else {
            $this->error('❌ Environment configuration issues:');
            foreach ($envIssues as $issue) {
                $this->error("   → {$issue} not set");
            }
        }

        // Check storage permissions
        $storageDirectories = [
            storage_path('app'),
            storage_path('framework'),
            storage_path('logs')
        ];

        $permissionIssues = [];
        foreach ($storageDirectories as $dir) {
            if (!is_writable($dir)) {
                $permissionIssues[] = $dir;
            }
        }

        if (empty($permissionIssues)) {
            $this->info('✅ Storage directories writable');
        } else {
            $this->error('❌ Storage permission issues:');
            foreach ($permissionIssues as $dir) {
                $this->error("   → {$dir} not writable");
            }
        }

        $this->newLine();
        $this->info('🏁 Comprehensive testing completed!');
    }
}

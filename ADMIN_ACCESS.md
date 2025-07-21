# Admin Access Documentation

## Hidden Admin Panel Access

The admin panel has been hidden from the main user interface but is still accessible through specific URLs and methods.

### Method 1: Direct URL Access
You can access the admin panel directly using these URLs:
- Admin Login: `/admin/login`
- Admin Registration: `/admin/signup`
- Admin Dashboard: `/admin`

### Method 2: Hidden Access Portal
Visit `/system` and enter the access code: `admin123`

### Method 3: Secret Code Access
The admin access is protected by a simple secret code system. You can modify the secret code in the `HiddenAdminAccess.jsx` component.

## User vs Admin Systems

### Regular User System
- **Login**: `/login` - Regular user login
- **Register**: `/register` - Regular user registration
- **Dashboard**: `/dashboard` - User dashboard with personal stats

### Admin System (Hidden)
- **Login**: `/admin/login` - Admin login
- **Register**: `/admin/signup` - Admin registration
- **Dashboard**: `/admin` - Admin dashboard with site-wide stats

## API Endpoints

### User Endpoints
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration
- `GET /api/user/dashboard` - User dashboard data
- `POST /api/user/logout` - User logout

### Admin Endpoints (Hidden)
- `POST /api/login` - Admin login
- `POST /api/register` - Admin registration
- `GET /api/dashboard` - Admin dashboard data
- `POST /api/logout` - Admin logout

## Security Notes

1. The admin routes are not linked from the main navigation
2. The secret code system provides an additional layer of access control
3. Both user and admin systems use the same User model but have different dashboards
4. Consider implementing role-based access control for production use

## Customization

To change the secret code:
1. Open `resources/js/components/HiddenAdminAccess.jsx`
2. Find the line: `if (secretCode === 'admin123')`
3. Replace `'admin123'` with your desired secret code

To add more security:
1. Implement environment variables for the secret code
2. Add rate limiting to the access portal
3. Implement IP-based restrictions
4. Add two-factor authentication for admin access 
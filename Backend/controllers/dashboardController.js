import { User } from '../models/User.js';

// Get dashboard data based on user role
export const getDashboardData = async (req, res) => {
  try {
    const user = req.user;
    const dashboardData = {
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email
      },
      timestamp: new Date().toISOString()
    };

    // Role-specific dashboard data
    switch (user.role) {
      case 'admin':
        dashboardData.adminData = await getAdminDashboard();
        break;
      case 'manager':
        dashboardData.managerData = await getManagerDashboard(user._id);
        break;
      case 'teacher':
        dashboardData.teacherData = await getTeacherDashboard(user._id);
        break;
      case 'student':
        dashboardData.studentData = await getStudentDashboard(user._id);
        break;
      default:
        dashboardData.userData = await getUserDashboard(user._id);
    }

    res.json({
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
};

// Admin dashboard data
const getAdminDashboard = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('username email role createdAt');

  return {
    stats: {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    },
    recentUsers,
    permissions: ['manage_users', 'view_analytics', 'system_settings']
  };
};

// Manager dashboard data
const getManagerDashboard = async (userId) => {
  const teamMembers = await User.countDocuments({ 
    role: { $in: ['user', 'student'] } 
  });
  
  return {
    stats: {
      teamMembers,
      activeProjects: 5, // Mock data - replace with actual project model
      completedTasks: 23, // Mock data
      pendingApprovals: 3 // Mock data
    },
    permissions: ['manage_team', 'view_reports', 'approve_requests'],
    quickActions: [
      'Review pending requests',
      'Generate team report',
      'Schedule team meeting'
    ]
  };
};

// Teacher dashboard data
const getTeacherDashboard = async (userId) => {
  return {
    stats: {
      totalStudents: 45, // Mock data - replace with actual student model
      activeClasses: 3,
      assignmentsToGrade: 12,
      upcomingClasses: 2
    },
    permissions: ['manage_classes', 'grade_assignments', 'view_student_progress'],
    quickActions: [
      'Grade pending assignments',
      'Create new assignment',
      'View class schedule',
      'Send announcements'
    ]
  };
};

// Student dashboard data
const getStudentDashboard = async (userId) => {
  return {
    stats: {
      enrolledCourses: 4, // Mock data
      completedAssignments: 18,
      pendingAssignments: 3,
      overallGrade: 'A-'
    },
    permissions: ['view_courses', 'submit_assignments', 'view_grades'],
    quickActions: [
      'View pending assignments',
      'Check grades',
      'Access course materials',
      'Join virtual classroom'
    ]
  };
};

// Regular user dashboard data
const getUserDashboard = async (userId) => {
  return {
    stats: {
      profileCompletion: 85, // Mock data
      lastActivity: new Date(),
      notifications: 2
    },
    permissions: ['view_profile', 'update_profile'],
    quickActions: [
      'Update profile',
      'View notifications',
      'Change password'
    ]
  };
};

// Get user statistics (admin only)
export const getUserStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied. Admin privileges required.'
      });
    }

    const stats = await getAdminDashboard();
    res.json({
      message: 'User statistics retrieved successfully',
      stats
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to get user statistics',
      error: error.message
    });
  }
};

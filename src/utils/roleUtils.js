// Role-based Access Control Utilities
// This file provides centralized role checking functions for the entire application

/**
 * Check if user has a specific role
 * @param {Object} user - User object with role property
 * @param {string|Array} role - Role or array of roles to check
 * @returns {boolean}
 */
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;

  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  const checkRoles = Array.isArray(role) ? role : [role];

  return checkRoles.some((checkRole) =>
    userRoles.some((userRole) => userRole === checkRole)
  );
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of roles to check
 * @returns {boolean}
 */
export const hasAnyRole = (user, roles) => {
  return hasRole(user, roles);
};

/**
 * Check if user has all of the specified roles
 * @param {Object} user - User object
 * @param {Array} roles - Array of roles to check
 * @returns {boolean}
 */
export const hasAllRoles = (user, roles) => {
  if (!user || !user.role) return false;

  const userRoles = Array.isArray(user.role) ? user.role : [user.role];
  return roles.every((role) => userRoles.includes(role));
};

// Role constants for consistency
export const ROLES = {
  ADMIN: "ADMIN",
  HR_ADMIN: "HR_ADMIN",
  ACCOUNTANT: "ACCOUNTANT",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
};

// Permission groups for different features
export const PERMISSIONS = {
  // User Management
  USER_MANAGEMENT: [ROLES.ADMIN, ROLES.HR_ADMIN],

  // Department Management
  DEPARTMENT_MANAGEMENT: [ROLES.ADMIN, ROLES.HR_ADMIN],

  // Payroll Management
  PAYROLL_MANAGEMENT: [ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.ACCOUNTANT],

  // Leave Management
  LEAVE_MANAGEMENT: [ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER],
  LEAVE_APPROVAL: [ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.MANAGER],

  // Job Management
  JOB_MANAGEMENT: [ROLES.ADMIN, ROLES.HR_ADMIN],

  // Reports and Analytics
  REPORTS_ACCESS: [
    ROLES.ADMIN,
    ROLES.HR_ADMIN,
    ROLES.ACCOUNTANT,
    ROLES.MANAGER,
  ],

  // Financial Data
  FINANCIAL_DATA: [ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.ACCOUNTANT],

  // System Administration
  SYSTEM_ADMIN: [ROLES.ADMIN],
};

/**
 * Check if user has permission for a specific feature
 * @param {Object} user - User object
 * @param {string} permission - Permission key from PERMISSIONS
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;

  return hasAnyRole(user, allowedRoles);
};

/**
 * Get user's display role (for UI)
 * @param {Object} user - User object
 * @returns {string}
 */
export const getUserDisplayRole = (user) => {
  if (!user || !user.role) return "Unknown";

  const roles = Array.isArray(user.role) ? user.role : [user.role];

  // Return the highest priority role
  if (roles.includes(ROLES.ADMIN)) return "Administrator";
  if (roles.includes(ROLES.HR_ADMIN)) return "HR Admin";
  if (roles.includes(ROLES.ACCOUNTANT)) return "Accountant";
  if (roles.includes(ROLES.MANAGER)) return "Manager";
  if (roles.includes(ROLES.EMPLOYEE)) return "Employee";

  return roles.join(", ");
};

/**
 * Check if user can view sensitive data
 * @param {Object} user - User object
 * @param {Object} dataOwner - Data owner object (for personal data)
 * @returns {boolean}
 */
export const canViewData = (user, dataOwner = null) => {
  // Admin, HR, and Accountant can view all data
  if (hasAnyRole(user, [ROLES.ADMIN, ROLES.HR_ADMIN, ROLES.ACCOUNTANT])) {
    return true;
  }

  // Managers can view their team's data
  if (hasRole(user, ROLES.MANAGER)) {
    // TODO: Implement team-based access logic
    return true;
  }

  // Employees can only view their own data
  if (hasRole(user, ROLES.EMPLOYEE) && dataOwner) {
    return user.id === dataOwner.id;
  }

  return false;
};

/**
 * Get role-based UI configuration
 * @param {Object} user - User object
 * @returns {Object} UI configuration
 */
export const getRoleBasedUIConfig = (user) => {
  return {
    showUserManagement: hasPermission(user, "USER_MANAGEMENT"),
    showDepartmentManagement: hasPermission(user, "DEPARTMENT_MANAGEMENT"),
    showPayrollManagement: hasPermission(user, "PAYROLL_MANAGEMENT"),
    showLeaveManagement: hasPermission(user, "LEAVE_MANAGEMENT"),
    showLeaveApproval: hasPermission(user, "LEAVE_APPROVAL"),
    showJobManagement: hasPermission(user, "JOB_MANAGEMENT"),
    showReports: hasPermission(user, "REPORTS_ACCESS"),
    showFinancialData: hasPermission(user, "FINANCIAL_DATA"),
    showSystemAdmin: hasPermission(user, "SYSTEM_ADMIN"),
  };
};

import React, { useEffect, useState } from "react";
import { useGetUser } from "../../AuthProvider/getUser";
import { 
  Users, Shield, UserCheck, Award, UserMinus, Loader2, AlertCircle,
  X, Check, ChevronDown, Search, RefreshCw
} from "lucide-react";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleType, setSelectedRoleType] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const { data: userData } = useGetUser();

  // Define moderator role types
  const moderatorRoleTypes = [
    { value: "Graphics Designer", label: "Graphics Designer" },
    { value: "Marketing Expert", label: "Marketing Expert" },
    { value: "Network Designer", label: "Network Designer" },
    { value: "Cyber Security Expert", label: "Cyber Security Expert" },
    { value: "Full Stack Developer", label: "Full Stack Developer" },
    { value: "Data Analyst", label: "Data Analyst" },
    { value: "Finance Coordinator", label: "Finance & Payment Coordinator" }
  ];

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://servies-pro-server.onrender.com/admin-users/${userData.userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const result = await res.json();
      setUsers(result);
      setFilteredUsers(result);
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.userId) {
      fetchUsers();
    }
  }, [userData?.userId]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleUpdateRole = async (id, action) => {
    setIsUpdating(true);
    try {
      let endpoint;
      let options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        }
      };

      switch (action) {
        case 'admin':
          endpoint = `https://servies-pro-server.onrender.com/make-admin/${id}`;
          break;
        case 'user':
          endpoint = `https://servies-pro-server.onrender.com/make-user/${id}`;
          break;
        case 'moderator':
          endpoint = `https://servies-pro-server.onrender.com/make-moderator/${id}`;
          // Send both the role and roleType to the backend
          options.body = JSON.stringify({ 
            role: "moderator", 
            roleType: selectedRoleType 
          });
          break;
        default:
          throw new Error("Invalid action");
      }
      
      const response = await fetch(endpoint, options);
      
      if (!response.ok) throw new Error("Failed to update user role");
      
      // Get updated role name for notification
      let roleName;
      if (action === 'admin') roleName = "Admin";
      else if (action === 'user') roleName = "Regular User";
      else {
        // Find the label for the selected role type
        const selectedRoleObj = moderatorRoleTypes.find(role => role.value === selectedRoleType);
        roleName = selectedRoleObj ? `Moderator (${selectedRoleObj.label})` : "Moderator";
      }
      
      showNotification(`User role successfully updated to ${roleName}`, "success");
      await fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      showNotification("Failed to update user role", "error");
    } finally {
      setIsUpdating(false);
      if (openModal) setOpenModal(false);
      setSelectedRole("");
      setSelectedRoleType("");
    }
  };

  const handleOpenModal = (id) => {
    setSelectedUserId(id);
    setSelectedRole("moderator");
    setSelectedRoleType(moderatorRoleTypes[0].value); // Set default to first option
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRole("");
    setSelectedRoleType("");
  };

  // Function to display the proper role name
  const getRoleName = (user) => {
    if (!user.role || user.role === "user") return "Regular User";
    if (user.role === "admin") return "Admin";
    
    // If it's a moderator with a roleType
    if (user.role === "moderator" && user.roleType) {
      const roleType = moderatorRoleTypes.find(r => r.value === user.roleType);
      return roleType ? `Moderator (${roleType.label})` : "Moderator";
    }
    
    // Fallback for legacy roles
    if (user.role === "moderator") return "Moderator";
    if (user.role === "editor") return "Editor";
    
    return user.role;
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin':
        return <Shield className="h-5 w-5 text-blue-500" />;
      case 'moderator':
        return <UserCheck className="h-5 w-5 text-green-500" />;
      case 'editor':
        return <Award className="h-5 w-5 text-purple-500" />;
      default:
        return <UserMinus className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading && !isUpdating) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-md">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <p className="text-red-700">Access denied or something went wrong!</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="mt-4 flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Users className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
        </div>
        
        {/* Search and refresh */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={fetchUsers}
            disabled={isLoading}
            className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-3 rounded-md flex items-center justify-between 
          ${notification.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
        >
          <div className="flex items-center">
            {notification.type === 'success' ? 
              <Check className="h-5 w-5 mr-2" /> : 
              <AlertCircle className="h-5 w-5 mr-2" />
            }
            <p>{notification.message}</p>
          </div>
          <button 
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {getRoleName(user)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!user.role || user.role === "user" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateRole(user._id, 'admin')}
                          disabled={isUpdating}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Shield className="h-4 w-4" /> Make Admin
                        </button>
                        <button
                          onClick={() => handleOpenModal(user._id)}
                          disabled={isUpdating}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4" /> Make Moderator
                        </button>
                      </div>
                    ) : user.role === "moderator" || user.role === "editor" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateRole(user._id, 'admin')}
                          disabled={isUpdating}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Shield className="h-4 w-4" /> Make Admin
                        </button>
                        <button
                          onClick={() => handleUpdateRole(user._id, 'user')}
                          disabled={isUpdating}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <UserMinus className="h-4 w-4" /> Make User
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(user._id)}
                          disabled={isUpdating}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4" /> Make Moderator
                        </button>
                        <button
                          onClick={() => handleUpdateRole(user._id, 'user')}
                          disabled={isUpdating}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <UserMinus className="h-4 w-4" /> Make User
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                  {searchTerm ? 
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <p>No users match "{searchTerm}"</p>
                      <button 
                        onClick={() => setSearchTerm("")}
                        className="mt-2 text-blue-500 hover:text-blue-700"
                      >
                        Clear search
                      </button>
                    </div>
                    : 
                    <div className="flex flex-col items-center">
                      <Users className="h-8 w-8 text-gray-400 mb-2" />
                      <p>No users found</p>
                    </div>
                  }
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Moderator Selection Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-full mx-4 transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Select Moderator Role</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Role Type</label>
              <div className="relative">
                <select
                  value={selectedRoleType}
                  onChange={(e) => setSelectedRoleType(e.target.value)}
                  className="block appearance-none w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {moderatorRoleTypes.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateRole(selectedUserId, 'moderator')}
                disabled={isUpdating}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageUser;
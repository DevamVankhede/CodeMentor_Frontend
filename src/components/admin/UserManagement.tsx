"use client";
import React, { useState, useEffect } from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Trash2, Edit, Plus, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  level: number;
  xpPoints: number;
  bugsFixed: number;
  gamesWon: number;
  currentStreak: number;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    isAdmin: false,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("auth_token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        setUsers(userData);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      const token = Cookies.get("auth_token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/admin/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        }
      );

      if (response.ok) {
        await fetchUsers();
        setShowCreateModal(false);
        setNewUser({ name: "", email: "", password: "", isAdmin: false });
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = Cookies.get("auth_token");
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({users.length})</CardTitle>
            <Button
              onClick={() => setShowCreateModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading users...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-secondary"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        Level {user.level} ({user.xpPoints} XP)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-primary mr-2"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={newUser.isAdmin}
                  onChange={(e) =>
                    setNewUser({ ...newUser, isAdmin: e.target.checked })
                  }
                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"
                />
                <label htmlFor="isAdmin" className="text-sm text-foreground">
                  Admin privileges
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleCreateUser}
                  className="flex-1"
                  disabled={
                    !newUser.name || !newUser.email || !newUser.password
                  }
                >
                  Create User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Level

                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Joined

                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">

                      Actions

                    </th>

                  </tr>

                </thead>

                <tbody className="bg-card divide-y divide-border">

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">

                        {user.name}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {user.email}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        <span

                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${

                            user.isAdmin

                              ? "bg-primary/20 text-primary"

                              : "bg-secondary/20 text-secondary"

                          }`}

                        >

                          {user.isAdmin ? "Admin" : "User"}

                        </span>

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        Level {user.level} ({user.xpPoints} XP)

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">

                        {new Date(user.createdAt).toLocaleDateString()}

                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-primary mr-2"

                          onClick={() => setEditingUser(user)}

                        >

                          <Edit className="w-4 h-4" />

                        </Button>

                        <Button

                          variant="ghost"

                          size="icon"

                          className="text-muted-foreground hover:text-destructive"

                          onClick={() => handleDeleteUser(user.id)}

                        >

                          <Trash2 className="w-4 h-4" />

                        </Button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>



      {/* Create User Modal */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <Card className="w-full max-w-md">

            <CardHeader>

              <CardTitle>Create New User</CardTitle>

            </CardHeader>

            <CardContent className="space-y-4">

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Name

                </label>

                <input

                  type="text"

                  value={newUser.name}

                  onChange={(e) =>

                    setNewUser({ ...newUser, name: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter name"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Email

                </label>

                <input

                  type="email"

                  value={newUser.email}

                  onChange={(e) =>

                    setNewUser({ ...newUser, email: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter email"

                />

              </div>

              <div>

                <label className="block text-sm font-medium text-foreground mb-1">

                  Password

                </label>

                <input

                  type="password"

                  value={newUser.password}

                  onChange={(e) =>

                    setNewUser({ ...newUser, password: e.target.value })

                  }

                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"

                  placeholder="Enter password"

                />

              </div>

              <div className="flex items-center space-x-2">

                <input

                  type="checkbox"

                  id="isAdmin"

                  checked={newUser.isAdmin}

                  onChange={(e) =>

                    setNewUser({ ...newUser, isAdmin: e.target.checked })

                  }

                  className="w-4 h-4 text-primary bg-surface-secondary border-border-primary rounded focus:ring-primary"

                />

                <label htmlFor="isAdmin" className="text-sm text-foreground">

                  Admin privileges

                </label>

              </div>

              <div className="flex gap-2 pt-4">

                <Button

                  onClick={handleCreateUser}

                  className="flex-1"

                  disabled={

                    !newUser.name || !newUser.email || !newUser.password

                  }

                >

                  Create User

                </Button>

                <Button

                  variant="outline"

                  onClick={() => setShowCreateModal(false)}

                  className="flex-1"

                >

                  Cancel

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>

  );

};



export default UserManagement;



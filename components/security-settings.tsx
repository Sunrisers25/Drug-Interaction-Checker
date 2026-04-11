"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  Key,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserCheck,
  Activity,
  Database,
  FileText,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "pharmacist" | "cashier" | "viewer"
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdAt: string
  permissions: string[]
}

interface SecurityLog {
  id: string
  timestamp: string
  event: string
  user: string
  ipAddress: string
  status: "success" | "failed" | "warning"
  details: string
}

const sampleUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@pharmacare.com",
    role: "admin",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    createdAt: "2023-01-01",
    permissions: ["all"],
  },
  {
    id: "2",
    username: "sarah.johnson",
    email: "sarah@pharmacare.com",
    role: "pharmacist",
    status: "active",
    lastLogin: "2024-01-15 13:45",
    createdAt: "2023-02-15",
    permissions: ["medicines", "patients", "interactions", "sales"],
  },
  {
    id: "3",
    username: "mike.wilson",
    email: "mike@pharmacare.com",
    role: "cashier",
    status: "active",
    lastLogin: "2024-01-15 12:20",
    createdAt: "2023-03-10",
    permissions: ["sales", "patients"],
  },
]

const sampleSecurityLogs: SecurityLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15 14:30:25",
    event: "User Login",
    user: "admin",
    ipAddress: "192.168.1.100",
    status: "success",
    details: "Successful login from admin dashboard",
  },
  {
    id: "2",
    timestamp: "2024-01-15 14:25:10",
    event: "Failed Login Attempt",
    user: "unknown",
    ipAddress: "192.168.1.150",
    status: "failed",
    details: "Invalid credentials for username 'test'",
  },
  {
    id: "3",
    timestamp: "2024-01-15 14:20:45",
    event: "Password Change",
    user: "sarah.johnson",
    ipAddress: "192.168.1.105",
    status: "success",
    details: "User changed password successfully",
  },
  {
    id: "4",
    timestamp: "2024-01-15 14:15:30",
    event: "Data Export",
    user: "admin",
    ipAddress: "192.168.1.100",
    status: "warning",
    details: "Exported patient data report",
  },
]

const rolePermissions = {
  admin: ["all"],
  pharmacist: ["medicines", "patients", "interactions", "sales", "reports"],
  cashier: ["sales", "patients"],
  viewer: ["reports"],
}

export function SecuritySettings() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(sampleSecurityLogs)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("users")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "cashier" as "admin" | "pharmacist" | "cashier" | "viewer",
  })

  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    sessionTimeout: 30,
    maxLoginAttempts: 3,
    twoFactorAuth: false,
    auditLogging: true,
    dataEncryption: true,
    backupFrequency: "daily",
  })

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastLogin: "Never",
      createdAt: new Date().toISOString().split("T")[0],
      permissions: rolePermissions[newUser.role],
    }

    setUsers([...users, user])
    setNewUser({ username: "", email: "", password: "", role: "cashier" })
    setIsAddUserOpen(false)

    toast({
      title: "Success",
      description: "User added successfully",
    })
  }

  const handleUpdateUserStatus = (userId: string, status: "active" | "inactive" | "suspended") => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status } : user)))
    toast({
      title: "Success",
      description: `User status updated to ${status}`,
    })
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    toast({
      title: "Success",
      description: "User deleted successfully",
    })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "pharmacist":
        return "bg-blue-100 text-blue-800"
      case "cashier":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLogStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Security & Authentication</h2>
          <p className="text-muted-foreground">Manage users, permissions, and security settings</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Security Level: High
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Settings
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Security Logs
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup & Recovery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* User Management Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">System Users</h3>
              <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
            </div>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account with appropriate permissions</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      placeholder="john.doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="john@pharmacare.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter secure password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddUser} className="w-full">
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Active Users ({users.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {user.lastLogin}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.permissions.slice(0, 3).map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                          {user.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{user.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={user.status}
                            onValueChange={(value: any) => handleUpdateUserStatus(user.id, value)}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={user.role === "admin"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Password Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password Policy
                </CardTitle>
                <CardDescription>Configure password requirements and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Input
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        passwordMinLength: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Require Special Characters</Label>
                  <Switch
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, requireSpecialChars: checked })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        maxLoginAttempts: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Session Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Session Management
                </CardTitle>
                <CardDescription>Configure session timeout and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Two-Factor Authentication</Label>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Audit Logging</Label>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, auditLogging: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Protection
                </CardTitle>
                <CardDescription>Configure data encryption and security measures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Data Encryption</Label>
                  <Switch
                    checked={securitySettings.dataEncryption}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, dataEncryption: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <Select
                    value={securitySettings.backupFrequency}
                    onValueChange={(value) => setSecuritySettings({ ...securitySettings, backupFrequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>Current security status and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">SSL Certificate</span>
                  <Badge className="bg-green-100 text-green-800">Valid</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Firewall Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Security Scan</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Failed Login Attempts (24h)</span>
                  <Badge className="bg-yellow-100 text-yellow-800">3</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>Save Security Settings</Button>
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Security Activity Log
              </CardTitle>
              <CardDescription>Monitor system access and security events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                      <TableCell>{log.event}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          {log.user}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getLogStatusIcon(log.status)}
                          <span className="capitalize">{log.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup Configuration
                </CardTitle>
                <CardDescription>Configure automatic backups and recovery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Backup Schedule</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily at 2:00 AM</SelectItem>
                      <SelectItem value="weekly">Weekly on Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Retention Period</Label>
                  <Select defaultValue="30days">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">7 Days</SelectItem>
                      <SelectItem value="30days">30 Days</SelectItem>
                      <SelectItem value="90days">90 Days</SelectItem>
                      <SelectItem value="1year">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Encrypt Backups</Label>
                  <Switch defaultChecked />
                </div>
                <Button className="w-full">Update Backup Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent Backups
                </CardTitle>
                <CardDescription>View and manage recent backup files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Full System Backup</p>
                      <p className="text-xs text-muted-foreground">2024-01-15 02:00:00</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Database Backup</p>
                      <p className="text-xs text-muted-foreground">2024-01-14 02:00:00</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Configuration Backup</p>
                      <p className="text-xs text-muted-foreground">2024-01-13 02:00:00</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Success</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Create Backup
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Restore
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

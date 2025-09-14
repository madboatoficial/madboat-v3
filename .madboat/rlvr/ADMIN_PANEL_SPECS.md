# 🐙 MadBoat RLVR Admin Panel Specifications
# @file .madboat/rlvr/ADMIN_PANEL_SPECS.md
# @version 2.0.0
# @created 2025-09-14
# @modified 2025-09-14
# @author Ostra, The Pearl Maker + Captain Sandro Fidelis
# @description Complete specifications for the RLVR admin panel and dashboard system

---

## 🎯 OVERVIEW

The MadBoat RLVR Admin Panel provides Captain Sandro with complete visibility and control over the agent evolution system. Like a ship's command center overlooking the digital ocean, this dashboard monitors, controls, and optimizes the entire agent ecosystem.

### Core Purpose
> "Captain, from this command deck you can witness the evolution of every digital soul in your fleet, guide their growth, and orchestrate their symphony of intelligence."

---

## 🏗️ SYSTEM ARCHITECTURE

### Technology Stack
```typescript
// Frontend Framework
interface AdminPanelStack {
  frontend: "Next.js 15 + React 19"
  styling: "Tailwind CSS + shadcn/ui"
  stateManagement: "Zustand + React Query"
  charts: "Recharts + D3.js"
  realtime: "WebSockets + Server-Sent Events"

  backend: "Next.js API Routes"
  database: "File-based YAML + Supabase for analytics"
  authentication: "Supabase Auth"
  deployment: "Vercel"
}
```

### Component Architecture
```
/admin/rlvr/
├── dashboard/             # Main overview page
├── agents/               # Individual agent details
│   ├── [agentId]/        # Agent-specific dashboard
│   └── compare/          # Agent comparison tools
├── evolution/            # Evolution tracking and analytics
├── controls/             # System controls and overrides
└── settings/             # Configuration and preferences
```

---

## 📊 DASHBOARD COMPONENTS

### 1. Fleet Overview Dashboard (`/admin/rlvr/dashboard`)

#### Agent Fleet Grid
```typescript
interface AgentCard {
  // Basic Info
  agentId: string
  name: string
  codename: string
  specialization: string
  status: 'active' | 'dormant' | 'evolution' | 'maintenance'

  // Evolution Metrics
  currentLevel: number
  levelTitle: string
  totalXP: number
  xpProgress: number // percentage to next level
  evolutionStage: string

  // Performance Indicators
  tasksCompletedToday: number
  xpGainedToday: number
  streakDays: number
  lastActive: Date

  // Visual Elements
  evolutionEmoji: string
  progressColor: 'green' | 'blue' | 'purple' | 'gold'
  glowEffect: boolean // for recently leveled up agents
}

const AgentCard: React.FC<{ agent: AgentCard }> = ({ agent }) => {
  return (
    <Card className={`relative ${agent.glowEffect ? 'ring-2 ring-gold animate-pulse' : ''}`}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="text-2xl mr-2">{agent.evolutionEmoji}</div>
        <div>
          <CardTitle className="text-sm">{agent.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{agent.codename}</p>
        </div>
        <Badge className="ml-auto" variant={agent.status === 'active' ? 'default' : 'secondary'}>
          {agent.status}
        </Badge>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Level {agent.currentLevel}</span>
          <span className="text-xs text-muted-foreground">{agent.levelTitle}</span>
        </div>

        <Progress value={agent.xpProgress} className="mb-2" />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{agent.totalXP} XP</span>
          <span>{agent.xpGainedToday} today</span>
        </div>

        {agent.streakDays > 0 && (
          <Badge variant="outline" className="mt-2 text-xs">
            🔥 {agent.streakDays} day streak
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
```

#### System Metrics Overview
```typescript
interface SystemMetrics {
  // Fleet Statistics
  totalAgents: number
  activeAgents: number
  averageLevel: number
  totalSystemXP: number

  // Growth Metrics
  dailyXPGain: number
  weeklyLevelUps: number
  monthlyBreakthroughs: number

  // Performance Health
  systemStatus: 'optimal' | 'good' | 'needs_attention' | 'critical'
  integrationCompletion: number // percentage
  evolutionVelocity: 'accelerating' | 'steady' | 'slowing'

  // Recent Activity
  recentLevelUps: AgentLevelUp[]
  recentAchievements: Achievement[]
  systemAlerts: SystemAlert[]
}

const SystemOverview: React.FC<{ metrics: SystemMetrics }> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Active Agents"
        value={`${metrics.activeAgents}/${metrics.totalAgents}`}
        change={`+${metrics.dailyXPGain} XP today`}
        icon="🐙"
        color="blue"
      />

      <MetricCard
        title="Average Level"
        value={metrics.averageLevel.toFixed(1)}
        change={`${metrics.weeklyLevelUps} level-ups this week`}
        icon="⭐"
        color="purple"
      />

      <MetricCard
        title="System XP"
        value={metrics.totalSystemXP.toLocaleString()}
        change={`Evolution: ${metrics.evolutionVelocity}`}
        icon="🌊"
        color="teal"
      />

      <MetricCard
        title="Integration"
        value={`${metrics.integrationCompletion}%`}
        change={`Status: ${metrics.systemStatus}`}
        icon="⚡"
        color={getStatusColor(metrics.systemStatus)}
      />
    </div>
  )
}
```

### 2. Agent Detail View (`/admin/rlvr/agents/[agentId]`)

#### Evolution Timeline
```typescript
interface EvolutionEvent {
  timestamp: Date
  type: 'level_up' | 'achievement' | 'breakthrough' | 'milestone'
  description: string
  xpAwarded: number
  level?: number
  achievement?: string
  context?: string
}

const EvolutionTimeline: React.FC<{ agentId: string }> = ({ agentId }) => {
  const { data: events } = useQuery(['evolution-timeline', agentId])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧬 Evolution Timeline
          <Badge variant="outline">{events?.length || 0} events</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {events?.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 ${getEventColor(event.type)}`} />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{event.description}</span>
                  {event.xpAwarded > 0 && (
                    <Badge variant="secondary">+{event.xpAwarded} XP</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </p>

                {event.context && (
                  <p className="text-xs text-muted-foreground mt-1">{event.context}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Performance Analytics
```typescript
interface AgentAnalytics {
  xpTrend: { date: string; xp: number }[]
  taskCompletion: { date: string; tasks: number }[]
  specializationProgress: { skill: string; level: number; maxLevel: number }[]
  collaborationNetwork: { agentId: string; interactions: number; successRate: number }[]
  personalityEvolution: { trait: string; value: number; trend: 'up' | 'down' | 'stable' }[]
}

const PerformanceCharts: React.FC<{ analytics: AgentAnalytics }> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* XP Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>XP Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.xpTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Specialization Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Specialization Mastery</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={analytics.specializationProgress}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis domain={[0, 10]} />
              <Radar dataKey="level" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Collaboration Network */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Collaboration Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analytics.collaborationNetwork.map((collab) => (
              <Badge key={collab.agentId} variant="outline" className="flex items-center gap-2">
                {collab.agentId}
                <span className="text-xs">
                  {collab.interactions} × {(collab.successRate * 100).toFixed(0)}%
                </span>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 3. Evolution Control Center (`/admin/rlvr/controls`)

#### Manual XP Awards
```typescript
interface XPAwardForm {
  agentId: string
  eventType: string
  description: string
  baseXP: number
  multiplier: number
  reason: string
}

const XPAwardPanel: React.FC = () => {
  const [form, setForm] = useState<XPAwardForm>({
    agentId: '',
    eventType: '',
    description: '',
    baseXP: 0,
    multiplier: 1.0,
    reason: ''
  })

  const { mutate: awardXP } = useMutation(awardManualXP)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🎁 Manual XP Award
          <Badge variant="destructive">Admin Only</Badge>
        </CardTitle>
        <CardDescription>
          Award XP to agents for exceptional performance or special circumstances
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="agent">Agent</Label>
            <Select value={form.agentId} onValueChange={(value) => setForm(f => ({ ...f, agentId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name} - {agent.codename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="eventType">Event Type</Label>
            <Select value={form.eventType} onValueChange={(value) => setForm(f => ({ ...f, eventType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exceptional_performance">Exceptional Performance</SelectItem>
                <SelectItem value="innovation_breakthrough">Innovation Breakthrough</SelectItem>
                <SelectItem value="emergency_resolution">Emergency Resolution</SelectItem>
                <SelectItem value="captain_appreciation">Captain Appreciation</SelectItem>
                <SelectItem value="system_contribution">System Contribution</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Describe why this XP award is being given..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="baseXP">Base XP Amount</Label>
            <Input
              type="number"
              value={form.baseXP}
              onChange={(e) => setForm(f => ({ ...f, baseXP: parseInt(e.target.value) }))}
            />
          </div>

          <div>
            <Label htmlFor="multiplier">Multiplier</Label>
            <Select value={form.multiplier.toString()} onValueChange={(value) => setForm(f => ({ ...f, multiplier: parseFloat(value) }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5x (Minor)</SelectItem>
                <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                <SelectItem value="1.5">1.5x (Good)</SelectItem>
                <SelectItem value="2.0">2.0x (Excellent)</SelectItem>
                <SelectItem value="3.0">3.0x (Exceptional)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span>Final XP Award:</span>
            <Badge variant="secondary" className="text-lg">
              {Math.floor(form.baseXP * form.multiplier)} XP
            </Badge>
          </div>
        </div>

        <Button
          onClick={() => awardXP(form)}
          disabled={!form.agentId || !form.description || form.baseXP <= 0}
          className="w-full"
        >
          🎁 Award XP
        </Button>
      </CardContent>
    </Card>
  )
}
```

#### Level Override System
```typescript
interface LevelOverride {
  agentId: string
  targetLevel: number
  reason: string
  authorization: string
}

const EmergencyControls: React.FC = () => {
  const [showOverride, setShowOverride] = useState(false)

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          🚨 Emergency Controls
          <Badge variant="destructive">Dangerous</Badge>
        </CardTitle>
        <CardDescription>
          Emergency system controls for critical situations only
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              These controls can disrupt agent evolution. Use only in emergency situations.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="destructive"
              onClick={() => setShowOverride(true)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Level Override
            </Button>

            <Button
              variant="destructive"
              onClick={() => resetAgentXP()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Agent XP
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => exportSystemState()}
            className="w-full"
          >
            💾 Export System State
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

## 🔌 API ENDPOINTS

### Agent Management
```typescript
// GET /api/rlvr/agents
interface AgentListResponse {
  agents: AgentSummary[]
  totalCount: number
  activeCount: number
  systemMetrics: SystemMetrics
}

// GET /api/rlvr/agents/[agentId]
interface AgentDetailResponse {
  agent: AgentStats
  evolution: EvolutionEvent[]
  analytics: AgentAnalytics
  recentActivity: XPEvent[]
}

// POST /api/rlvr/agents/[agentId]/award-xp
interface AwardXPRequest {
  eventType: string
  description: string
  baseXP: number
  multiplier?: number
  reason: string
  authorization: string
}

// PUT /api/rlvr/agents/[agentId]/level
interface LevelOverrideRequest {
  targetLevel: number
  reason: string
  authorization: string
  bypassSafety: boolean
}
```

### System Metrics
```typescript
// GET /api/rlvr/metrics/system
interface SystemMetricsResponse {
  overview: SystemMetrics
  trends: GrowthTrends
  health: SystemHealth
  alerts: SystemAlert[]
}

// GET /api/rlvr/metrics/evolution
interface EvolutionMetricsResponse {
  levelDistribution: LevelStats[]
  xpTrends: XPTrendData[]
  specializationGrowth: SpecializationStats[]
  collaborationMatrix: CollaborationData[]
}

// GET /api/rlvr/events/recent
interface RecentEventsResponse {
  events: XPEvent[]
  levelUps: LevelUpEvent[]
  achievements: AchievementEvent[]
  systemEvents: SystemEvent[]
}
```

### Real-time Updates
```typescript
// WebSocket: /api/rlvr/realtime
interface RealtimeMessage {
  type: 'xp_awarded' | 'level_up' | 'achievement' | 'system_alert'
  agentId?: string
  data: any
  timestamp: Date
}

// Server-Sent Events: /api/rlvr/stream
interface SSEMessage {
  event: string
  data: string
  id?: string
}
```

---

## 🎨 UI/UX SPECIFICATIONS

### Design System
```scss
// Color Palette
:root {
  --ocean-depths: #0f172a;      // Dark backgrounds
  --coral-bright: #f97316;      // Accent colors
  --pearl-white: #fafafa;       // Light backgrounds
  --kraken-purple: #8b5cf6;     // Primary purple
  --poseidon-blue: #3b82f6;     // Primary blue
  --evolution-gold: #f59e0b;    // Level up highlights

  // Evolution Gradients
  --seedling-gradient: linear-gradient(135deg, #10b981, #34d399);
  --apprentice-gradient: linear-gradient(135deg, #3b82f6, #60a5fa);
  --master-gradient: linear-gradient(135deg, #8b5cf6, #a78bfa);
  --deity-gradient: linear-gradient(135deg, #f59e0b, #fbbf24);
}
```

### Responsive Design
```typescript
const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '1024px',   // Tablet landscape / Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px' // Ultra-wide
}

// Mobile-first responsive design
const MobileLayout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 space-y-4">
      {/* Mobile: Single column */}
      <div className="block md:hidden">
        <MobileAgentGrid />
      </div>

      {/* Tablet: Two columns */}
      <div className="hidden md:block lg:hidden">
        <TabletAgentGrid />
      </div>

      {/* Desktop: Full layout */}
      <div className="hidden lg:block">
        <DesktopDashboard />
      </div>
    </div>
  )
}
```

### Animation System
```typescript
const EvolutionAnimations = {
  levelUp: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 0.6, ease: "easeInOut" }
    }
  },

  xpGain: {
    initial: { y: 0, opacity: 0 },
    animate: {
      y: -20,
      opacity: [0, 1, 0],
      transition: { duration: 0.8, ease: "easeOut" }
    }
  },

  evolutionGlow: {
    animate: {
      boxShadow: [
        "0 0 0 rgba(139, 92, 246, 0)",
        "0 0 20px rgba(139, 92, 246, 0.5)",
        "0 0 0 rgba(139, 92, 246, 0)"
      ],
      transition: { duration: 2, repeat: Infinity }
    }
  }
}
```

---

## 📱 MOBILE OPTIMIZATIONS

### Progressive Web App Features
```typescript
// PWA Configuration
const pwaConfig = {
  name: "MadBoat RLVR Admin",
  shortName: "RLVR Admin",
  description: "Agent evolution monitoring and control",
  themeColor: "#8b5cf6",
  backgroundColor: "#0f172a",
  display: "standalone",
  orientation: "portrait",

  icons: [
    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }
  ]
}

// Mobile Navigation
const MobileNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t lg:hidden">
      <div className="flex items-center justify-around p-2">
        <NavItem icon="🏠" label="Dashboard" href="/admin/rlvr" />
        <NavItem icon="🐙" label="Agents" href="/admin/rlvr/agents" />
        <NavItem icon="📊" label="Evolution" href="/admin/rlvr/evolution" />
        <NavItem icon="⚙️" label="Controls" href="/admin/rlvr/controls" />
      </div>
    </nav>
  )
}
```

---

## 🔒 SECURITY & PERMISSIONS

### Role-Based Access Control
```typescript
interface UserRoles {
  captain: {
    permissions: [
      'view_all_agents',
      'award_manual_xp',
      'level_override',
      'system_controls',
      'export_data',
      'emergency_actions'
    ]
  }

  developer: {
    permissions: [
      'view_all_agents',
      'view_analytics',
      'award_manual_xp'
    ]
  }

  viewer: {
    permissions: [
      'view_own_agents',
      'view_public_metrics'
    ]
  }
}

// Permission Middleware
const requirePermission = (permission: string) => {
  return (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    const user = getUserFromToken(req)

    if (!user || !hasPermission(user, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }

    next()
  }
}
```

---

## 🚀 DEPLOYMENT SPECIFICATIONS

### Environment Configuration
```typescript
// Production Environment
interface ProductionConfig {
  database: {
    supabase_url: string
    supabase_anon_key: string
    files_path: ".madboat/rlvr/"
  }

  auth: {
    jwt_secret: string
    session_duration: "7d"
    admin_emails: string[]
  }

  monitoring: {
    sentry_dsn: string
    analytics_id: string
    log_level: "error"
  }

  features: {
    real_time_updates: true
    mobile_notifications: true
    auto_backups: true
    admin_alerts: true
  }
}
```

### Performance Optimizations
```typescript
// Caching Strategy
const cacheConfig = {
  agentData: "1 minute",        // Fast updates for active agents
  systemMetrics: "5 minutes",   // Moderate updates for metrics
  evolutionHistory: "1 hour",   // Slow updates for historical data

  // Redis Keys
  keys: {
    agentStats: "rlvr:agent:{agentId}:stats",
    systemMetrics: "rlvr:system:metrics",
    recentEvents: "rlvr:events:recent"
  }
}

// Database Optimization
const dbOptimizations = {
  indexing: [
    "agent_id",
    "timestamp",
    "level",
    "xp_total"
  ],

  partitioning: "monthly",
  archiving: "6_months",
  compression: true
}
```

---

## 🎯 SUCCESS METRICS

### Admin Panel KPIs
```typescript
interface AdminPanelMetrics {
  usageMetrics: {
    dailyActiveUsers: number
    pageViews: number
    sessionDuration: number
    featureUsage: Record<string, number>
  }

  systemImpact: {
    xpAwardsIssued: number
    levelOverridesUsed: number
    emergencyActionsTriggered: number
    dataExports: number
  }

  performance: {
    pageLoadTime: number
    apiResponseTime: number
    realtimeLatency: number
    uptime: number
  }
}
```

---

*From the depths of data, clarity emerges.*
*From the chaos of metrics, wisdom is born.*
*Through this command center, Captain Sandro guides*
*The evolution of his digital fleet toward excellence.*

~ Ostra, The Pearl Maker 🦪

**Next Phase:** Implementation of the admin panel using Next.js 15, React 19, and the MadBoat design system.
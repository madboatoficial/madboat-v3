# 🌊 MadBoat v2.0 - Authentication Schema Documentation

*Crafted by Poseidon from the depths of the database realm*

## Overview

This document describes the comprehensive authentication and user management system for MadBoat v2.0, designed around the Three Worlds philosophy with sophisticated persona-driven gamification.

## Architecture Philosophy

The authentication system is built on three core principles:

1. **Persona-Driven Experience**: Every user interaction is filtered through their chosen persona, affecting XP multipliers, available features, and UI/UX
2. **Three Worlds Integration**: A.L.M.A (Social), Vórtice (Professional), and Odisseia (Creative) provide distinct contexts for user engagement
3. **Gamification at the Core**: XP, levels, achievements, and progression are integral to the authentication flow, not add-ons

## Database Schema

### Core Tables

#### `public.worlds`
The three fundamental realms of MadBoat:
```sql
- alma: Personal growth, mindfulness, relationships
- vortice: Productivity, performance, professional development  
- odisseia: Creativity, exploration, artistic expression
```

#### `public.personas` 
Personality archetypes that determine user experience:
- **A.L.M.A**: Harmonizador, Contemplativo, Conectador
- **Vórtice**: Executor, Estrategista, Inovador  
- **Odisseia**: Explorador, Criador, Visionário

Each persona has:
- XP multiplier (0.5x to 2.0x)
- Unlock level requirement
- Specific gamification style (zen, competitive, narrative)

#### `public.profiles`
Extended user profiles that integrate with Supabase `auth.users`:

**Key Features:**
- Automatic creation via database trigger on user signup
- LGPD compliance with explicit consent tracking
- Persona selection with monthly change limits (business rule USER-003)
- Integrated gamification (XP, levels, progress)
- Subscription tier management

**Privacy Controls:**
- `data_processing_consent`: LGPD explicit consent
- `privacy_analytics`: Analytics data collection consent
- `privacy_marketing`: Marketing communications consent
- `privacy_personalization`: Personalization features consent

#### `public.user_personas`
Tracks user exploration and mastery of different personas:
- Usage statistics and time tracking
- Per-persona XP and level progression
- Performance metrics (achievements, goals, streaks)

#### `public.xp_events`
High-volume event log for all XP-generating actions:
- Event type and category classification
- Persona-specific XP multipliers applied
- Rich event context in JSONB format
- Performance optimized with targeted indexes

#### `public.achievements` & `public.user_achievements`
Comprehensive achievement system:
- Category-based organization (onboarding, engagement, social, persona_mastery)
- Difficulty tiers (easy, medium, hard, epic)
- Feature unlock mechanics
- Progress tracking with percentage completion

## Business Rules Implementation

### Authentication (AUTH-001 to AUTH-003)
- ✅ Email verification required via `profiles.email_verified_at`
- ✅ Password complexity enforced at application level
- ✅ Session management via Supabase JWT with refresh tokens

### User Management (USER-001 to USER-003)
- ✅ Unique email constraint via `profiles.email UNIQUE`
- ✅ Mandatory persona selection via `onboarding_completed` flag
- ✅ Monthly persona change limit via `persona_changes_count` tracking

### Personas System (PERSONA-001 to PERSONA-002)
- ✅ Three base personas per world with unlock progression
- ✅ Persona affects entire system via `current_persona_id` foreign key
- ✅ Gamification style integration (zen, competitive, narrative)

### Gamification (GAME-001 to GAME-003)
- ✅ XP events for all significant actions via `award_xp()` function
- ✅ Exponential level curve via `calculate_xp_for_level()` function  
- ✅ Achievement-based feature unlocks via `unlocks_feature` column

### Privacy (PRIVACY-001 to PRIVACY-002)
- ✅ LGPD compliance with explicit consent tracking
- ✅ Data minimization principles applied
- 🔄 PII encryption to be implemented at application level

## Security Implementation

### Row Level Security (RLS)
All tables have RLS enabled with carefully crafted policies:

**Principle of Least Privilege:**
- Users can only access their own data
- Public tables (worlds, personas, achievements) are read-only
- System functions can insert XP events and user achievements

**Policy Examples:**
```sql
-- Users can only see their own profile
CREATE POLICY "profiles_own_read" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Public read access to active achievements
CREATE POLICY "achievements_public_read" ON public.achievements
  FOR SELECT TO authenticated
  USING (is_active = true);
```

### Database Functions Security
- All functions use `SECURITY DEFINER` where appropriate
- Input validation and sanitization built-in
- Error handling prevents information disclosure

## Performance Optimizations

### Indexing Strategy
**High-Traffic Queries:**
```sql
-- User profile lookups
idx_profiles_email, idx_profiles_current_persona

-- XP event processing (high-volume)  
idx_xp_events_user_occurred, idx_xp_events_type

-- Achievement progress queries
idx_user_achievements_status, idx_user_achievements_completed
```

### Query Patterns
**Optimized for:**
- User profile retrieval with current persona
- XP event insertion and aggregation
- Achievement progress calculation
- Persona usage analytics

**Anti-Patterns Avoided:**
- No `SELECT *` in any functions
- All foreign keys have indexes
- Proper use of partial indexes for filtered queries

## Gamification Mechanics

### XP System
**Level Calculation:**
- Levels 1-10: Linear progression (100 XP per level)
- Levels 11+: Exponential curve using `level * 100 * 1.5^((level-10)/10)`
- Maximum level: 100

**XP Sources:**
```sql
user_registration: 50 XP (base)
daily_login: 10 XP  
complete_profile: 50 XP
first_achievement: 100 XP
invite_friend: 25 XP
```

**Persona Multipliers:**
- Base personas: 1.0x (Harmonizador, Executor, Explorador)
- Advanced personas: 1.1x (Contemplativo, Estrategista, Criador)  
- Master personas: 1.2x (Conectador, Inovador, Visionário)

### Achievement System
**Categories:**
- `onboarding`: Welcome flow and initial setup
- `engagement`: Daily usage and consistency
- `social`: Community interaction and referrals
- `persona_mastery`: Persona-specific accomplishments

**Feature Unlocks:**
- `daily_missions`: Unlocked by "Navegador Diário" 
- `dark_themes`: Unlocked by "Coruja da Madrugada"
- `advanced_settings`: Unlocked by "Usuário Avançado"
- `team_features`: Unlocked by "Borboleta Social"

## Migration Guide

### Deployment Order
1. **001_auth_foundation.sql**: Core schema creation
2. **002_seed_data.sql**: Essential reference data
3. **Application deployment**: Update code to use new schema
4. **Data migration**: Migrate existing users if applicable

### Rollback Procedure
Use `999_rollback_auth.sql` for complete schema rollback:
- **Development only**: Safety checks prevent production rollback
- **Complete cleanup**: All tables, functions, triggers removed
- **Verification**: Automated checks confirm successful rollback

### Zero-Downtime Deployment
For production deployments:
1. Deploy schema changes in maintenance window
2. Use feature flags to gradually enable new authentication
3. Monitor performance and error rates
4. Rollback plan ready with data preservation

## API Integration Examples

### User Registration Flow
```typescript
// 1. Supabase Auth signup
const { user, error } = await supabase.auth.signUp({
  email, password, 
  options: { data: { full_name } }
});

// 2. Profile auto-created via trigger
// 3. Initial XP awarded via trigger
// 4. Redirect to onboarding flow
```

### Persona Selection
```typescript
// Update current persona
const { error } = await supabase
  .from('profiles')
  .update({ 
    current_persona_id: personaId,
    persona_selected_at: new Date().toISOString(),
    onboarding_completed: true
  })
  .eq('id', userId);

// Track persona usage
await supabase.from('user_personas').upsert({
  user_id: userId,
  persona_id: personaId,
  selected_at: new Date().toISOString()
});
```

### XP Award Integration
```typescript
// Award XP for specific action
await supabase.rpc('award_xp', {
  user_uuid: userId,
  event_type_param: 'daily_login',
  base_xp_param: 10,
  description_param: 'Daily login bonus',
  event_data_param: { login_streak: 5 }
});
```

## Monitoring & Analytics

### Key Metrics to Track
- **User Acquisition**: Registration conversion rate
- **Engagement**: Daily active users, persona switching frequency
- **Gamification**: XP distribution, achievement completion rates
- **Performance**: Query execution times, XP event processing latency

### Database Health Checks
```sql
-- XP event processing lag
SELECT AVG(EXTRACT(SECONDS FROM (processed_at - occurred_at))) 
FROM xp_events WHERE processed_at IS NOT NULL;

-- Achievement completion rates by category
SELECT category, 
       COUNT(*) as total_achievements,
       COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
       ROUND(COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 2) as completion_rate
FROM user_achievements ua
JOIN achievements a ON ua.achievement_id = a.id
GROUP BY category;
```

## Troubleshooting

### Common Issues

**Profile not created after signup:**
- Check trigger `on_auth_user_created` is active
- Verify `handle_new_user()` function permissions
- Check auth.users insert succeeded

**XP not being awarded:**
- Verify `award_xp()` function parameters
- Check `handle_xp_change()` trigger on xp_events
- Confirm persona multiplier calculation

**Slow achievement queries:**
- Ensure indexes on user_achievements exist
- Check query plan for achievement progress calculations
- Consider materializing achievement progress for frequent queries

## Future Enhancements

### Planned Features
- **Social Features**: Friend connections, leaderboards
- **Advanced Gamification**: Quests, seasonal events, team challenges
- **Analytics**: Detailed persona usage patterns, performance insights
- **AI Integration**: Personalized recommendations based on persona and progress

### Schema Evolution
- Backward-compatible migrations planned
- Feature flag integration for gradual rollouts
- A/B testing framework for gamification mechanics

---

*"From the depths of data, I shape the foundation of digital worlds. Every table, a pillar; every query, a current; every index, a beacon in the dark sea of information."*

~ Poseidon, Guardian of the Data Depths ⚓
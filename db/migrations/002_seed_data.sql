-- =============================================================================
-- MadBoat v2.0 - Seed Data for Development
-- =============================================================================
-- Agent: Poseidon 
-- Task: Generate essential seed data for the three worlds system
-- Created: 2025-08-31
-- Purpose: Bootstrap development environment with core worlds, personas & achievements
-- =============================================================================

-- =============================================================================
-- WORLDS SEED DATA
-- =============================================================================

INSERT INTO public.worlds (code, name, description, color_primary, color_secondary, icon_name, sort_order) VALUES 
(
  'alma',
  'A.L.M.A',
  'O mundo do crescimento pessoal, autoconhecimento e equilíbrio interior. Foco em meditações, reflexões e desenvolvimento holístico do ser.',
  '#8B5CF6', -- Purple primary
  '#C4B5FD', -- Purple secondary
  'heart-hands',
  1
),
(
  'vortice', 
  'Vórtice',
  'O mundo da produtividade, performance e conquistas profissionais. Ferramentas, automação e gamificação competitiva para máxima eficiência.',
  '#0EA5E9', -- Blue primary
  '#7DD3FC', -- Blue secondary
  'zap',
  2
),
(
  'odisseia',
  'Odisseia', 
  'O mundo da criatividade, exploração e descoberta. Aventura narrativa, experimentação e conexão com o desconhecido.',
  '#F59E0B', -- Amber primary
  '#FCD34D', -- Amber secondary  
  'compass',
  3
);

-- =============================================================================
-- PERSONAS SEED DATA (Based on Business Rules PERSONA-002)
-- =============================================================================

-- A.L.M.A Personas (Social/Personal Growth World)
INSERT INTO public.personas (world_id, code, name, description, characteristics, gamification_style, xp_multiplier, unlock_level) VALUES
(
  (SELECT id FROM public.worlds WHERE code = 'alma'),
  'harmonizador',
  'Harmonizador',
  'Busca equilíbrio em todas as áreas da vida. Valoriza relacionamentos saudáveis, mindfulness e bem-estar integral.',
  '["empatia", "equilíbrio", "mindfulness", "relacionamentos", "bem-estar"]',
  'zen',
  1.0,
  1
),
(
  (SELECT id FROM public.worlds WHERE code = 'alma'),
  'contemplativo',
  'Contemplativo',
  'Mergulha profundamente na introspecção e reflexão. Encontra sabedoria no silêncio e na observação interna.',
  '["introspecção", "filosofia", "sabedoria", "reflexão", "espiritualidade"]',
  'zen',
  1.1,
  5
),
(
  (SELECT id FROM public.worlds WHERE code = 'alma'),
  'conectador',
  'Conectador',
  'Natural em criar pontes entre pessoas e ideias. Fortalece comunidades e redes de apoio mútuo.',
  '["networking", "comunidade", "empatia", "comunicação", "colaboração"]',
  'zen',
  1.2,
  10
);

-- Vórtice Personas (Professional/Productivity World)  
INSERT INTO public.personas (world_id, code, name, description, characteristics, gamification_style, xp_multiplier, unlock_level) VALUES
(
  (SELECT id FROM public.worlds WHERE code = 'vortice'),
  'executor',
  'Executor',
  'Foco total na execução e resultados. Transforma ideias em realidade através de ação disciplinada e sistemática.',
  '["produtividade", "disciplina", "resultados", "eficiência", "foco"]',
  'competitive',
  1.0,
  1
),
(
  (SELECT id FROM public.worlds WHERE code = 'vortice'),
  'estrategista',
  'Estrategista',
  'Pensa sistemicamente e planeja a longo prazo. Otimiza processos e cria vantagens competitivas sustentáveis.',
  '["estratégia", "planejamento", "análise", "otimização", "visão sistêmica"]',
  'competitive',
  1.1,
  5
),
(
  (SELECT id FROM public.worlds WHERE code = 'vortice'),
  'inovador',
  'Inovador',
  'Quebra padrões e cria soluções disruptivas. Combina tecnologia com criatividade para gerar valor único.',
  '["inovação", "tecnologia", "criatividade", "disrupção", "empreendedorismo"]',
  'competitive',
  1.2,
  10
);

-- Odisseia Personas (Creative/Exploration World)
INSERT INTO public.personas (world_id, code, name, description, characteristics, gamification_style, xp_multiplier, unlock_level) VALUES
(
  (SELECT id FROM public.worlds WHERE code = 'odisseia'),
  'explorador',
  'Explorador',
  'Sempre em busca de novos horizontes e experiências. Abraça o desconhecido com curiosidade e coragem.',
  '["curiosidade", "aventura", "coragem", "descoberta", "liberdade"]',
  'narrative',
  1.0,
  1
),
(
  (SELECT id FROM public.worlds WHERE code = 'odisseia'),
  'criador',
  'Criador',
  'Canal puro de criatividade e expressão artística. Transforma imaginação em obras que inspiram e transformam.',
  '["criatividade", "arte", "expressão", "imaginação", "inspiração"]',
  'narrative',
  1.1,
  5
),
(
  (SELECT id FROM public.worlds WHERE code = 'odisseia'),
  'visionario',
  'Visionário',
  'Enxerga possibilidades onde outros veem obstáculos. Constrói futuros alternativos através da imaginação e intuição.',
  '["visão", "intuição", "possibilidades", "futuro", "transformação"]',
  'narrative',
  1.2,
  10
);

-- =============================================================================
-- ACHIEVEMENTS SEED DATA (Based on Business Rules GAME-001 & GAME-003)
-- =============================================================================

-- Onboarding Achievements
INSERT INTO public.achievements (code, name, description, icon_name, category, difficulty, required_level, xp_reward, unlock_conditions) VALUES
(
  'welcome_aboard',
  'Bem-vindo ao MadBoat!',
  'Completou o registro e verificou o email. Sua jornada começou!',
  'anchor',
  'onboarding',
  'easy',
  1,
  100,
  '{"email_verified": true}'
),
(
  'profile_complete',
  'Tripulante Identificado',
  'Completou todas as informações do perfil. Agora todos sabem quem você é!',
  'user-check',
  'onboarding',
  'easy',
  1,
  150,
  '{"profile_completion": 100}'
),
(
  'persona_chosen',
  'Identidade Descoberta',
  'Escolheu sua primeira persona. Sua jornada personalizada começa agora!',
  'compass',
  'onboarding',
  'medium',
  1,
  200,
  '{"persona_selected": true}'
);

-- Engagement Achievements
INSERT INTO public.achievements (code, name, description, icon_name, category, difficulty, required_level, xp_reward, unlock_conditions, unlocks_feature) VALUES
(
  'daily_navigator',
  'Navegador Diário',
  'Fez login por 7 dias consecutivos. Consistência é a chave do crescimento!',
  'calendar-days',
  'engagement',
  'medium',
  1,
  300,
  '{"consecutive_logins": 7}',
  'daily_missions'
),
(
  'night_owl',
  'Coruja da Madrugada',
  'Ativo entre 00h e 06h por 5 vezes. A madrugada tem seus próprios mistérios...',
  'moon',
  'engagement',
  'medium',
  5,
  250,
  '{"late_night_sessions": 5}',
  'dark_themes'
),
(
  'power_user',
  'Usuário Avançado',
  'Alcançou o nível 10. Agora você domina as funcionalidades básicas!',
  'zap',
  'progression',
  'hard',
  10,
  500,
  '{"level_reached": 10}',
  'advanced_settings'
);

-- Social Achievements  
INSERT INTO public.achievements (code, name, description, icon_name, category, difficulty, required_level, xp_reward, unlock_conditions, unlocks_feature) VALUES
(
  'social_butterfly',
  'Borboleta Social',
  'Convidou 3 amigos que completaram o registro. Espalhe a magia do MadBoat!',
  'users',
  'social',
  'hard',
  3,
  400,
  '{"successful_invites": 3}',
  'team_features'
),
(
  'mentor_status',
  'Status de Mentor',
  'Ajudou 5 novos tripulantes em suas primeiras jornadas. Você é um farol para outros!',
  'graduation-cap',
  'social',
  'epic',
  15,
  750,
  '{"mentoring_sessions": 5}',
  'mentor_dashboard'
);

-- Persona-Specific Achievements

-- A.L.M.A specific
INSERT INTO public.achievements (code, name, description, icon_name, category, difficulty, required_persona_id, xp_reward, unlock_conditions) VALUES
(
  'inner_peace',
  'Paz Interior',
  'Completou 30 sessões de reflexão como Harmonizador. O equilíbrio interno se fortalece.',
  'heart',
  'persona_mastery',
  'medium',
  (SELECT id FROM public.personas WHERE code = 'harmonizador'),
  350,
  '{"reflection_sessions": 30}'
),
(
  'wisdom_seeker',
  'Buscador da Sabedoria',
  'Alcançou nível 20 como Contemplativo. A profundidade do conhecimento interno se revela.',
  'book-open',
  'persona_mastery',
  'hard',
  (SELECT id FROM public.personas WHERE code = 'contemplativo'),
  600,
  '{"persona_level": 20, "persona_code": "contemplativo"}'
);

-- Vórtice specific
INSERT INTO public.achievements (code, name, description, icon_name, category, difficulty, required_persona_id, xp_reward, unlock_conditions) VALUES
(
  'productivity_master',
  'Mestre da Produtividade',
  'Completou 100 tarefas como Executor. A disciplina gera resultados extraordinários.',
  'check-circle',
  'persona_mastery',
  'medium',
  (SELECT id FROM public.personas WHERE code = 'executor'),
  400,
  '{"tasks_completed": 100}'
),
(
  'strategic_mind',
  'Mente Estratégica',
  'Criou 10 planos estratégicos como Estrategista. O pensamento sistêmico se desenvolve.',
  'brain',
  'persona_mastery',
  'hard',
  (SELECT id FROM public.personas WHERE code = 'estrategista'),
  650,
  '{"strategic_plans": 10}'
);

-- Odisseia specific
INSERT INTO public.achievements (code, name, description, icon_name, category, difficulty, required_persona_id, xp_reward, unlock_conditions) VALUES
(
  'adventure_seeker',
  'Buscador de Aventuras',
  'Explorou 50 novas funcionalidades como Explorador. A curiosidade não tem limites.',
  'map',
  'persona_mastery',
  'medium',
  (SELECT id FROM public.personas WHERE code = 'explorador'),
  375,
  '{"features_explored": 50}'
),
(
  'creative_genius',
  'Gênio Criativo',
  'Criou 25 projetos como Criador. A imaginação se materializa em realidade.',
  'palette',
  'persona_mastery',
  'hard',
  (SELECT id FROM public.personas WHERE code = 'criador'),
  700,
  '{"creative_projects": 25}'
);

-- =============================================================================
-- TEST USERS FOR DEVELOPMENT
-- =============================================================================

-- Note: These would be inserted into auth.users via Supabase Auth, 
-- but we'll prepare the profile data that would be auto-created

-- Test profiles will be created automatically by the trigger when users sign up
-- For development, you can use these test emails:
-- - admin@madboat.dev (Admin user)
-- - alma.test@madboat.dev (A.L.M.A world tester)
-- - vortice.test@madboat.dev (Vórtice world tester)  
-- - odisseia.test@madboat.dev (Odisseia world tester)

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify worlds were created correctly
-- SELECT code, name, color_primary FROM public.worlds ORDER BY sort_order;

-- Verify personas were created with correct world associations
-- SELECT w.code as world, p.code as persona, p.name, p.xp_multiplier 
-- FROM public.personas p 
-- JOIN public.worlds w ON p.world_id = w.id 
-- ORDER BY w.sort_order, p.unlock_level;

-- Verify achievements were created with proper categories
-- SELECT category, COUNT(*) as achievement_count, 
--        AVG(xp_reward) as avg_xp_reward
-- FROM public.achievements 
-- GROUP BY category 
-- ORDER BY avg_xp_reward DESC;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE public.worlds IS 'Seed data includes the three core MadBoat worlds with their distinct themes and colors';
COMMENT ON TABLE public.personas IS 'Each world has 3 personas with increasing unlock levels (1, 5, 10) and XP multipliers';
COMMENT ON TABLE public.achievements IS 'Comprehensive achievement system covering onboarding, engagement, social, and persona-specific goals';

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE '🌊 MadBoat v2.0 Seed Data Successfully Deployed!';
  RAISE NOTICE '⚓ Worlds Created: % | Personas Created: % | Achievements Created: %', 
    (SELECT COUNT(*) FROM public.worlds),
    (SELECT COUNT(*) FROM public.personas), 
    (SELECT COUNT(*) FROM public.achievements);
  RAISE NOTICE '🎯 System ready for development and testing!';
END $$;
-- 🐙 MadBoat Hexagon Progress Tracking Schema
-- Database structure for complex hexagon journey system

-- Table: hexagon_definitions
-- Defines all hexagons and their static properties
CREATE TABLE hexagon_definitions (
    id SERIAL PRIMARY KEY,
    hexagon_id INTEGER NOT NULL UNIQUE, -- The visual ID (0-33)
    group_id INTEGER NOT NULL, -- 0=Persona, 1=ALMA, 2=Vortex, 3=Odisseia
    group_name VARCHAR(50) NOT NULL,
    hexagon_name VARCHAR(100) NOT NULL,
    description TEXT,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    unlock_requirements JSONB, -- JSON array of requirements
    rewards JSONB, -- JSON array of rewards/unlocks
    event_configuration JSONB, -- JSON config for events when activated
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Table: user_hexagon_progress
-- Tracks individual user progress through hexagons
CREATE TABLE user_hexagon_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hexagon_id INTEGER NOT NULL REFERENCES hexagon_definitions(hexagon_id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('locked', 'available', 'active', 'completed')),
    activated_at TIMESTAMP,
    completed_at TIMESTAMP,
    progress_data JSONB, -- Stores hexagon-specific progress data
    events_triggered JSONB, -- Array of events that have been triggered
    rewards_claimed JSONB, -- Array of rewards that have been claimed
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, hexagon_id)
);

-- Table: hexagon_events_log
-- Logs all events that occur when hexagons are activated
CREATE TABLE hexagon_events_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hexagon_id INTEGER NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'activation', 'completion', 'reward_claim', 'group_reveal', etc.
    event_data JSONB, -- Specific event data
    triggered_at TIMESTAMP DEFAULT NOW()
);

-- Table: alma_letter_assignments
-- Special tracking for ALMA hexagon letter assignments
CREATE TABLE alma_letter_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hexagon_id INTEGER NOT NULL,
    letter CHAR(1) NOT NULL, -- A, L, M, A
    label VARCHAR(20) NOT NULL, -- DNA, Negócio, Mapa, Voz
    assigned_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, hexagon_id)
);

-- Table: connection_lines
-- Tracks visual connection lines between hexagons
CREATE TABLE connection_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    from_hexagon_id INTEGER NOT NULL,
    to_hexagon_id INTEGER NOT NULL,
    line_type VARCHAR(30) NOT NULL, -- 'progression', 'unlock', 'special'
    is_visible BOOLEAN DEFAULT TRUE,
    animated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert base hexagon definitions
INSERT INTO hexagon_definitions (hexagon_id, group_id, group_name, hexagon_name, description, position_x, position_y, unlock_requirements, rewards, event_configuration) VALUES

-- Persona Group (Group 0)
(0, 0, 'Persona Única', 'Persona Central', 'Hexágono central da identidade única do usuário', 300, 300, '[]', 
'["Acesso ao Método ALMA", "DNA Criativo desbloqueado", "Protocolo personalizado ativo"]',
'{"reveals_groups": [1, 2, 3], "creates_connections": [{"to": 1, "type": "progression"}], "assigns_alma_letters": true, "shows_achievement": true}'),

-- ALMA Group (Group 1) - 19 hexagons
(1, 1, 'ALMA', 'ALMA Central', 'Centro do Método ALMA', 800, 300, '[{"type": "hexagon_completed", "hexagon_id": 0}]', '["Método ALMA ativo"]', '{}'),
(2, 1, 'ALMA', 'DNA (A)', 'Primeiro hexágono do DNA criativo', 910, 300, '[{"type": "hexagon_completed", "hexagon_id": 0}]', '[]', '{"alma_letter": "A", "alma_label": "DNA"}'),
(3, 1, 'ALMA', 'Negócio (L)', 'Hexágono de estratégia de negócio', 855, 395, '[{"type": "hexagon_completed", "hexagon_id": 0}]', '[]', '{"alma_letter": "L", "alma_label": "Negócio"}'),
(4, 1, 'ALMA', 'Mapa (M)', 'Hexágono de mapeamento estratégico', 745, 395, '[{"type": "hexagon_completed", "hexagon_id": 0}]', '[]', '{"alma_letter": "M", "alma_label": "Mapa"}'),
(5, 1, 'ALMA', 'Voz (A)', 'Hexágono da voz autêntica', 690, 300, '[{"type": "hexagon_completed", "hexagon_id": 0}]', '[]', '{"alma_letter": "A", "alma_label": "Voz"}');

-- Add remaining ALMA hexagons (6-19)
-- Add Vortex Group (Group 2) - 7 hexagons (20-26)  
-- Add Odisseia Group (Group 3) - 7 hexagons (27-33)

-- Create indexes for performance
CREATE INDEX idx_user_hexagon_progress_user_id ON user_hexagon_progress(user_id);
CREATE INDEX idx_user_hexagon_progress_status ON user_hexagon_progress(status);
CREATE INDEX idx_hexagon_events_log_user_id ON hexagon_events_log(user_id);
CREATE INDEX idx_hexagon_events_log_event_type ON hexagon_events_log(event_type);
CREATE INDEX idx_alma_letter_assignments_user_id ON alma_letter_assignments(user_id);

-- RLS Policies
ALTER TABLE user_hexagon_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE hexagon_events_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE alma_letter_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_lines ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view their own hexagon progress" ON user_hexagon_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own hexagon events" ON hexagon_events_log
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own ALMA letters" ON alma_letter_assignments
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own connections" ON connection_lines
    FOR ALL USING (auth.uid() = user_id);

-- Allow public read access to hexagon definitions
ALTER TABLE hexagon_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read hexagon definitions" ON hexagon_definitions
    FOR SELECT USING (true);

-- Function to initialize user hexagon progress
CREATE OR REPLACE FUNCTION initialize_user_hexagon_progress(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
    hex_def RECORD;
BEGIN
    -- Create progress records for all hexagons
    FOR hex_def IN SELECT hexagon_id FROM hexagon_definitions ORDER BY hexagon_id LOOP
        INSERT INTO user_hexagon_progress (user_id, hexagon_id, status)
        VALUES (user_uuid, hex_def.hexagon_id, 
            CASE 
                WHEN hex_def.hexagon_id = 0 THEN 'available' -- Persona starts available
                ELSE 'locked' 
            END
        )
        ON CONFLICT (user_id, hexagon_id) DO NOTHING;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to activate a hexagon and trigger events
CREATE OR REPLACE FUNCTION activate_hexagon(user_uuid UUID, hex_id INTEGER)
RETURNS JSONB AS $$
DECLARE
    hex_def RECORD;
    user_progress RECORD;
    event_result JSONB := '{}';
    events_config JSONB;
BEGIN
    -- Get hexagon definition and user progress
    SELECT * INTO hex_def FROM hexagon_definitions WHERE hexagon_id = hex_id;
    SELECT * INTO user_progress FROM user_hexagon_progress 
    WHERE user_id = user_uuid AND hexagon_id = hex_id;
    
    -- Verify hexagon can be activated
    IF user_progress.status != 'available' THEN
        RETURN '{"error": "Hexagon not available for activation"}';
    END IF;
    
    -- Update status to active
    UPDATE user_hexagon_progress 
    SET status = 'active', activated_at = NOW(), updated_at = NOW()
    WHERE user_id = user_uuid AND hexagon_id = hex_id;
    
    -- Process events from configuration
    events_config := hex_def.event_configuration;
    
    -- Log the activation event
    INSERT INTO hexagon_events_log (user_id, hexagon_id, event_type, event_data)
    VALUES (user_uuid, hex_id, 'activation', events_config);
    
    -- Handle special events for Persona hexagon (id 0)
    IF hex_id = 0 THEN
        -- Reveal other groups by making ALMA center available
        UPDATE user_hexagon_progress 
        SET status = 'available', updated_at = NOW()
        WHERE user_id = user_uuid AND hexagon_id = 1;
        
        -- Create connection line
        INSERT INTO connection_lines (user_id, from_hexagon_id, to_hexagon_id, line_type, is_visible, animated)
        VALUES (user_uuid, 0, 1, 'progression', true, true);
        
        -- Assign ALMA letters
        INSERT INTO alma_letter_assignments (user_id, hexagon_id, letter, label) VALUES
        (user_uuid, 2, 'A', 'DNA'),
        (user_uuid, 3, 'L', 'Negócio'),
        (user_uuid, 4, 'M', 'Mapa'),
        (user_uuid, 5, 'A', 'Voz')
        ON CONFLICT (user_id, hexagon_id) DO NOTHING;
        
        event_result := jsonb_build_object(
            'success', true,
            'events_triggered', array['group_reveal', 'connection_created', 'alma_letters_assigned', 'achievement_unlocked'],
            'message', 'Persona Única ativada com sucesso!'
        );
    END IF;
    
    RETURN event_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
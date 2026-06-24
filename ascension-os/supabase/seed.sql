-- Seed data for Erwan's profile
-- Run AFTER creating a user with email and getting their user_id from auth.users
-- Replace 'YOUR_USER_ID' with the actual UUID from Supabase Auth dashboard

-- To use: Go to Supabase > Authentication > Users, find Erwan's user, copy the UUID
-- Then replace all instances of 'YOUR_USER_ID' below

DO $$
DECLARE
  uid uuid := 'YOUR_USER_ID'; -- Replace with actual user UUID
  obj1_id uuid;
  obj2_id uuid;
  obj3_id uuid;
  obj4_id uuid;
  obj5_id uuid;
BEGIN

-- Profile (750 XP = Level 9, Rank D)
INSERT INTO public.profiles (user_id, username, total_xp, level, rank, streak, coins, last_active_date)
VALUES (uid, 'Erwan', 2250, 16, 'C', 7, 145, current_date)
ON CONFLICT (user_id) DO UPDATE SET
  username = 'Erwan', total_xp = 2250, level = 16, rank = 'C', streak = 7, coins = 145;

-- Skills
INSERT INTO public.skills (user_id, domain, xp, level) VALUES
  (uid, 'fitness', 550, 8),
  (uid, 'ai_automation', 700, 9),
  (uid, 'business_sales', 300, 6),
  (uid, 'mba_studies', 400, 7),
  (uid, 'music_production', 150, 4),
  (uid, 'mind_discipline', 250, 6),
  (uid, 'social_networking', 100, 4)
ON CONFLICT (user_id, domain) DO UPDATE SET xp = EXCLUDED.xp, level = EXCLUDED.level;

-- Daily quests
INSERT INTO public.quests (user_id, title, description, domain, difficulty, xp_reward, coin_reward, status, quest_type, repeat_type)
VALUES
  (uid, '90 min deep work session', 'Fully focused, phone away, no distractions', 'mind_discipline', 'hard', 100, 10, 'pending', 'daily', 'daily'),
  (uid, 'Gym session', 'Push/pull/legs or full body', 'fitness', 'medium', 50, 5, 'pending', 'daily', 'daily'),
  (uid, 'Work on AI automation project', 'Build or improve an AI agent or workflow', 'ai_automation', 'medium', 50, 5, 'pending', 'daily', 'daily'),
  (uid, 'Apply to 1 job/internship', 'International roles, data/AI focused', 'business_sales', 'easy', 25, 3, 'pending', 'daily', 'daily'),
  (uid, '30 min music production', 'Work on a beat or sound design', 'music_production', 'easy', 25, 3, 'pending', 'daily', 'daily'),
  (uid, 'Read or study 30 min', 'MBA material, business books, or AI papers', 'mba_studies', 'easy', 25, 3, 'pending', 'daily', 'daily');

-- Weekly quests
INSERT INTO public.quests (user_id, title, description, domain, difficulty, xp_reward, coin_reward, status, quest_type, repeat_type)
VALUES
  (uid, 'Build 1 complete AI workflow', 'End-to-end automation using n8n, Make or LangChain', 'ai_automation', 'hard', 100, 10, 'pending', 'weekly', 'weekly'),
  (uid, 'Contact 5 recruiters on LinkedIn', 'Personalized outreach for international roles', 'social_networking', 'medium', 50, 5, 'pending', 'weekly', 'weekly'),
  (uid, 'Finish 1 MBA module or chapter', 'Big Data, Analytics or Business Strategy', 'mba_studies', 'medium', 50, 5, 'pending', 'weekly', 'weekly'),
  (uid, 'Produce 1 full track or loop pack', 'Export and save to portfolio folder', 'music_production', 'hard', 100, 10, 'pending', 'weekly', 'weekly'),
  (uid, 'Complete 5 gym sessions this week', 'Consistency is the key to physique goals', 'fitness', 'boss', 250, 25, 'pending', 'weekly', 'weekly');

-- Long-term quests
INSERT INTO public.quests (user_id, title, description, domain, difficulty, xp_reward, coin_reward, status, quest_type, repeat_type, due_date)
VALUES
  (uid, 'Land international internship', 'Data/AI role in EU or USA', 'business_sales', 'boss', 250, 50, 'pending', 'longterm', 'none', '2025-09-01'),
  (uid, 'Build 10 AI agents / automations', 'Document each one in portfolio', 'ai_automation', 'boss', 250, 50, 'pending', 'longterm', 'none', '2025-12-31'),
  (uid, 'Get first freelance AI client', 'Minimum 500 EUR project', 'business_sales', 'boss', 250, 50, 'pending', 'longterm', 'none', '2025-10-01'),
  (uid, 'Complete PL-300 certification', 'Power BI Data Analyst Associate', 'mba_studies', 'hard', 100, 20, 'pending', 'longterm', 'none', '2025-08-01'),
  (uid, 'Release 10 music tracks', 'On SoundCloud, Spotify or BeatStars', 'music_production', 'hard', 100, 20, 'pending', 'longterm', 'none', '2025-12-31'),
  (uid, 'Reach 80kg lean bodyweight', 'Track with weekly weigh-ins', 'fitness', 'boss', 250, 30, 'pending', 'longterm', 'none', '2025-12-31');

-- Objectives
INSERT INTO public.objectives (id, user_id, title, description, domain, status, due_date)
VALUES
  (gen_random_uuid(), uid, 'Get international internship', 'Land a data/AI internship in Europe or abroad to accelerate career growth', 'business_sales', 'active', '2025-09-01')
RETURNING id INTO obj1_id;

INSERT INTO public.objectives (id, user_id, title, description, domain, status, due_date)
VALUES
  (gen_random_uuid(), uid, 'Build AI automation portfolio', 'Create 10 documented AI agents and automation workflows', 'ai_automation', 'active', '2025-12-31')
RETURNING id INTO obj2_id;

INSERT INTO public.objectives (id, user_id, title, description, domain, status, due_date)
VALUES
  (gen_random_uuid(), uid, 'First freelance AI client', 'Get first paying client for AI automation services', 'business_sales', 'active', '2025-10-01')
RETURNING id INTO obj3_id;

INSERT INTO public.objectives (id, user_id, title, description, domain, status, due_date)
VALUES
  (gen_random_uuid(), uid, 'Fitness: 80kg lean', 'Reach 80kg with visible muscle and low body fat', 'fitness', 'active', '2025-12-31')
RETURNING id INTO obj4_id;

INSERT INTO public.objectives (id, user_id, title, description, domain, status, due_date)
VALUES
  (gen_random_uuid(), uid, 'Music: 10 released tracks', 'Release 10 original productions on streaming platforms', 'music_production', 'active', '2025-12-31')
RETURNING id INTO obj5_id;

-- Milestones for obj1 (International internship)
INSERT INTO public.milestones (objective_id, user_id, title, status, xp_reward) VALUES
  (obj1_id, uid, 'Update CV to international standard', 'completed', 25),
  (obj1_id, uid, 'Build LinkedIn profile (EN)', 'completed', 25),
  (obj1_id, uid, 'Apply to 50 roles', 'pending', 100),
  (obj1_id, uid, 'Contact 30 recruiters', 'pending', 75),
  (obj1_id, uid, 'Do 5 mock interviews', 'pending', 50),
  (obj1_id, uid, 'Receive 1 offer', 'pending', 250);

-- Milestones for obj2 (AI portfolio)
INSERT INTO public.milestones (objective_id, user_id, title, status, xp_reward) VALUES
  (obj2_id, uid, 'Build first n8n workflow', 'completed', 50),
  (obj2_id, uid, 'Build LangChain agent', 'completed', 50),
  (obj2_id, uid, 'Create portfolio website', 'pending', 50),
  (obj2_id, uid, 'Build 5 automations', 'pending', 100),
  (obj2_id, uid, 'Build 10 automations', 'pending', 250),
  (obj2_id, uid, 'Publish case studies', 'pending', 75);

-- Milestones for obj3 (Freelance)
INSERT INTO public.milestones (objective_id, user_id, title, status, xp_reward) VALUES
  (obj3_id, uid, 'Create Malt/Upwork profile', 'pending', 25),
  (obj3_id, uid, 'Define service offering', 'pending', 25),
  (obj3_id, uid, 'Send 20 cold outreach messages', 'pending', 50),
  (obj3_id, uid, 'Do first discovery call', 'pending', 50),
  (obj3_id, uid, 'Close first client (500+ EUR)', 'pending', 250);

-- Milestones for obj4 (Fitness)
INSERT INTO public.milestones (objective_id, user_id, title, status, xp_reward) VALUES
  (obj4_id, uid, 'Set baseline weight & photos', 'completed', 25),
  (obj4_id, uid, 'Build 5-day training program', 'completed', 25),
  (obj4_id, uid, 'Dial in nutrition plan', 'pending', 50),
  (obj4_id, uid, 'Hit 75kg', 'pending', 100),
  (obj4_id, uid, 'Hit 78kg', 'pending', 150),
  (obj4_id, uid, 'Hit 80kg lean', 'pending', 250);

-- Milestones for obj5 (Music)
INSERT INTO public.milestones (objective_id, user_id, title, status, xp_reward) VALUES
  (obj5_id, uid, 'Set up DAW and sample library', 'completed', 25),
  (obj5_id, uid, 'Release first track', 'pending', 100),
  (obj5_id, uid, 'Release 5 tracks', 'pending', 150),
  (obj5_id, uid, 'Release 10 tracks', 'pending', 250);

END $$;

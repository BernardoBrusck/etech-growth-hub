-- Create enum types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'sales', 'user');
CREATE TYPE public.lead_status AS ENUM ('novo', 'contato', 'negociacao', 'fechado', 'perdido');
CREATE TYPE public.lead_stage AS ENUM ('prospeccao', 'diagnostico', 'negociacao', 'fechamento', 'c7');
CREATE TYPE public.deal_status AS ENUM ('open', 'won', 'lost', 'cancelled');
CREATE TYPE public.activity_type AS ENUM ('call', 'email', 'meeting', 'task', 'note');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');

-- Create profiles table for users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'user',
  department TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_id UUID REFERENCES public.companies(id),
  company_name TEXT,
  status lead_status DEFAULT 'novo',
  stage lead_stage DEFAULT 'prospeccao',
  value DECIMAL(12,2) DEFAULT 0,
  responsible_id UUID REFERENCES public.profiles(id),
  source TEXT,
  notes TEXT,
  days_in_stage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  company_id UUID REFERENCES public.companies(id),
  value DECIMAL(12,2) NOT NULL,
  status deal_status DEFAULT 'open',
  probability INTEGER DEFAULT 50,
  expected_close_date DATE,
  actual_close_date DATE,
  responsible_id UUID REFERENCES public.profiles(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type activity_type NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  deal_id UUID REFERENCES public.deals(id),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create financial_transactions table
CREATE TABLE public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  type transaction_type NOT NULL,
  category TEXT,
  deal_id UUID REFERENCES public.deals(id),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  transaction_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(12,2) NOT NULL,
  current_value DECIMAL(12,2) DEFAULT 0,
  target_date DATE,
  user_id UUID REFERENCES public.profiles(id),
  team_goal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_events table
CREATE TABLE public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  deal_id UUID REFERENCES public.deals(id),
  activity_id UUID REFERENCES public.activities(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for companies
CREATE POLICY "Authenticated users can view companies" ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update companies" ON public.companies FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete companies" ON public.companies FOR DELETE TO authenticated USING (public.get_user_role() IN ('admin', 'manager'));

-- RLS Policies for leads
CREATE POLICY "Authenticated users can view leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert leads" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update leads" ON public.leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only managers and admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.get_user_role() IN ('admin', 'manager'));

-- RLS Policies for deals
CREATE POLICY "Authenticated users can view deals" ON public.deals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert deals" ON public.deals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update deals" ON public.deals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Only managers and admins can delete deals" ON public.deals FOR DELETE TO authenticated USING (public.get_user_role() IN ('admin', 'manager'));

-- RLS Policies for activities
CREATE POLICY "Users can view all activities" ON public.activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own activities" ON public.activities FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));
CREATE POLICY "Users can delete own activities" ON public.activities FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));

-- RLS Policies for financial_transactions
CREATE POLICY "Users can view financial transactions" ON public.financial_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert financial transactions" ON public.financial_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.financial_transactions FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));
CREATE POLICY "Only managers and admins can delete transactions" ON public.financial_transactions FOR DELETE TO authenticated USING (public.get_user_role() IN ('admin', 'manager'));

-- RLS Policies for goals
CREATE POLICY "Users can view goals" ON public.goals FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert goals" ON public.goals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR team_goal = true);
CREATE POLICY "Users can update own goals" ON public.goals FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));
CREATE POLICY "Users can delete own goals" ON public.goals FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));

-- RLS Policies for calendar_events
CREATE POLICY "Users can view calendar events" ON public.calendar_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert calendar events" ON public.calendar_events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own events" ON public.calendar_events FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));
CREATE POLICY "Users can delete own events" ON public.calendar_events FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.get_user_role() IN ('admin', 'manager'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at on all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON public.deals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON public.financial_transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_leads_responsible_id ON public.leads(responsible_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_deals_responsible_id ON public.deals(responsible_id);
CREATE INDEX idx_deals_status ON public.deals(status);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX idx_financial_transactions_user_id ON public.financial_transactions(user_id);
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events(user_id);
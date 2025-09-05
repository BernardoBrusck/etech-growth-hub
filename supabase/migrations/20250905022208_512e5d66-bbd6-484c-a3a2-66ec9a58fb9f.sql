-- Insert sample profiles with demo data
INSERT INTO public.profiles (id, email, full_name, role, department, phone) VALUES
(gen_random_uuid(), 'admin@demo.com', 'Administrador Demo', 'admin', 'TI', '(11) 99999-0001'),
(gen_random_uuid(), 'manager@demo.com', 'Gerente Demo', 'manager', 'Vendas', '(11) 99999-0002'),
(gen_random_uuid(), 'user@demo.com', 'Vendedor Demo', 'user', 'Vendas', '(11) 99999-0003');

-- Insert sample companies
INSERT INTO public.companies (id, name, cnpj, email, phone, address, city, state, website) VALUES
(gen_random_uuid(), 'Tech Solutions Ltda', '12.345.678/0001-90', 'contato@techsolutions.com', '(11) 3456-7890', 'Av. Paulista, 1000', 'São Paulo', 'SP', 'techsolutions.com'),
(gen_random_uuid(), 'Inovação Digital S.A.', '98.765.432/0001-10', 'vendas@inovacaodigital.com', '(11) 2345-6789', 'Rua Augusta, 500', 'São Paulo', 'SP', 'inovacaodigital.com'),
(gen_random_uuid(), 'StartUp Brasil ME', '11.222.333/0001-44', 'info@startupbrasil.com', '(11) 9876-5432', 'Rua Oscar Freire, 200', 'São Paulo', 'SP', 'startupbrasil.com');

-- Get user IDs for leads
DO $$
DECLARE
    admin_id uuid;
    manager_id uuid;
    user_id uuid;
    company1_id uuid;
    company2_id uuid;
    company3_id uuid;
BEGIN
    SELECT id INTO admin_id FROM public.profiles WHERE email = 'admin@demo.com';
    SELECT id INTO manager_id FROM public.profiles WHERE email = 'manager@demo.com';
    SELECT id INTO user_id FROM public.profiles WHERE email = 'user@demo.com';
    
    SELECT id INTO company1_id FROM public.companies WHERE name = 'Tech Solutions Ltda';
    SELECT id INTO company2_id FROM public.companies WHERE name = 'Inovação Digital S.A.';
    SELECT id INTO company3_id FROM public.companies WHERE name = 'StartUp Brasil ME';

    -- Insert sample leads
    INSERT INTO public.leads (id, name, email, phone, company_name, company_id, status, stage, value, responsible_id, source, notes, days_in_stage) VALUES
    (gen_random_uuid(), 'Carlos Silva', 'carlos.silva@techsolutions.com', '(11) 98765-4321', 'Tech Solutions Ltda', company1_id, 'negociacao', 'negociacao', 50000, admin_id, 'Indicação', 'Cliente interessado em consultoria em IA', 5),
    (gen_random_uuid(), 'Maria Santos', 'maria.santos@inovacaodigital.com', '(11) 87654-3210', 'Inovação Digital S.A.', company2_id, 'contato', 'diagnostico', 35000, manager_id, 'Website', 'Precisa de automação de processos', 12),
    (gen_random_uuid(), 'João Oliveira', 'joao@startupbrasil.com', '(11) 76543-2109', 'StartUp Brasil ME', company3_id, 'novo', 'prospeccao', 25000, user_id, 'LinkedIn', 'Startup em crescimento', 3),
    (gen_random_uuid(), 'Ana Costa', 'ana.costa@empresa.com', '(11) 65432-1098', 'Empresa ABC', NULL, 'fechado', 'c7', 75000, admin_id, 'Telefone', 'Projeto finalizado com sucesso', 0),
    (gen_random_uuid(), 'Pedro Fernandes', 'pedro@fernandes.com', '(11) 54321-0987', 'Fernandes & Cia', NULL, 'perdido', 'negociacao', 40000, manager_id, 'Email', 'Cliente escolheu concorrente', 20);

    -- Insert sample financial transactions
    INSERT INTO public.financial_transactions (id, title, description, type, amount, category, transaction_date, user_id, deal_id) VALUES
    (gen_random_uuid(), 'Consultoria IA - Tech Solutions', 'Pagamento recebido do projeto de consultoria', 'income', 50000, 'Vendas', CURRENT_DATE - INTERVAL '5 days', admin_id, NULL),
    (gen_random_uuid(), 'Licenças de Software', 'Renovação de licenças anuais', 'expense', 12000, 'Operacional', CURRENT_DATE - INTERVAL '10 days', admin_id, NULL),
    (gen_random_uuid(), 'Comissão de Vendas', 'Comissão da venda para StartUp Brasil', 'expense', 5000, 'Comissões', CURRENT_DATE - INTERVAL '3 days', manager_id, NULL);

    -- Insert sample goals
    INSERT INTO public.goals (id, title, description, target_value, current_value, target_date, user_id, team_goal) VALUES
    (gen_random_uuid(), 'Meta de Vendas Q1', 'Alcançar R$ 500.000 em vendas no primeiro trimestre', 500000, 125000, CURRENT_DATE + INTERVAL '30 days', admin_id, true),
    (gen_random_uuid(), 'Conversão de Leads', 'Melhorar taxa de conversão para 30%', 30, 23.5, CURRENT_DATE + INTERVAL '60 days', manager_id, false),
    (gen_random_uuid(), 'Novos Clientes', 'Cadastrar 20 novos leads por mês', 20, 8, CURRENT_DATE + INTERVAL '20 days', user_id, false);

    -- Insert sample activities
    INSERT INTO public.activities (id, title, description, type, scheduled_at, is_completed, user_id, lead_id) VALUES
    (gen_random_uuid(), 'Ligação de Follow-up', 'Ligar para Carlos Silva sobre proposta', 'call', NOW() + INTERVAL '2 hours', false, admin_id, (SELECT id FROM public.leads WHERE name = 'Carlos Silva')),
    (gen_random_uuid(), 'Reunião de Diagnóstico', 'Reunião com Maria Santos para levantamento', 'meeting', NOW() + INTERVAL '1 day', false, manager_id, (SELECT id FROM public.leads WHERE name = 'Maria Santos')),
    (gen_random_uuid(), 'Envio de Proposta', 'Enviar proposta comercial por email', 'email', NOW() + INTERVAL '3 hours', false, user_id, (SELECT id FROM public.leads WHERE name = 'João Oliveira'));

END $$;
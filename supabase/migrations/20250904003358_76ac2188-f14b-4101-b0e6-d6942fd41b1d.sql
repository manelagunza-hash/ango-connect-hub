-- Adicionar dados de exemplo para o sistema

-- Inserir profissionais de exemplo
INSERT INTO public.professionals (name, email, phone, profession, description, location, hourly_rate, is_verified, rating, total_reviews) VALUES
('João Silva', 'joao.silva@email.com', '+244 923 456 789', 'Eletricista', 'Mais de 10 anos de experiência em instalações elétricas residenciais e comerciais. Serviços de manutenção, reparos e instalações novas.', 'Luanda, Maianga', 2500.00, true, 4.8, 15),
('Maria Santos', 'maria.santos@email.com', '+244 934 567 890', 'Pedreiro', 'Especialista em construção civil, reformas e acabamentos. Trabalho com qualidade e pontualidade garantidas.', 'Luanda, Ingombota', 3000.00, true, 4.9, 23),
('Carlos Mendes', 'carlos.mendes@email.com', '+244 945 678 901', 'Encanador', 'Serviços de encanamento residencial e comercial. Instalação de tubulações, reparos e manutenção preventiva.', 'Luanda, Sambizanga', 2200.00, true, 4.5, 12),
('Ana Ferreira', 'ana.ferreira@email.com', '+244 956 789 012', 'Pintor', 'Pintura residencial e comercial com materiais de primeira qualidade. Orçamento gratuito e garantia de serviço.', 'Luanda, Rangel', 1800.00, true, 4.7, 18),
('Pedro Costa', 'pedro.costa@email.com', '+244 967 890 123', 'Carpinteiro', 'Móveis sob medida, portas, janelas e reparos em madeira. Trabalho artesanal com madeiras nobres e MDF.', 'Luanda, Viana', 2800.00, false, 4.6, 8),
('Sofia Oliveira', 'sofia.oliveira@email.com', '+244 978 901 234', 'Limpeza Doméstica', 'Serviços de limpeza residencial e comercial. Limpeza profunda, organização e manutenção regular.', 'Luanda, Cacuaco', 1500.00, true, 4.9, 31),
('Manuel Torres', 'manuel.torres@email.com', '+244 989 012 345', 'Jardineiro', 'Manutenção de jardins, paisagismo e cuidado de plantas. Criação de espaços verdes harmoniosos.', 'Luanda, Belas', 2000.00, false, 4.4, 6),
('Luísa Pereira', 'luisa.pereira@email.com', '+244 990 123 456', 'Técnico em Informática', 'Suporte técnico, manutenção de computadores e instalação de redes. Atendimento domiciliar e empresarial.', 'Luanda, Talatona', 3500.00, true, 4.8, 14);

-- Inserir algumas avaliações para os profissionais
INSERT INTO public.reviews (professional_id, rating, comment, client_id) VALUES
((SELECT id FROM public.professionals WHERE email = 'joao.silva@email.com'), 5, 'Excelente profissional! Resolveu o problema elétrico rapidamente e com muito cuidado.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'joao.silva@email.com'), 4, 'Bom trabalho, chegou no horário marcado e deixou tudo funcionando perfeitamente.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'maria.santos@email.com'), 5, 'Maria fez um trabalho impecável na reforma do meu banheiro. Super recomendo!', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'maria.santos@email.com'), 5, 'Profissional muito competente e honesta. Cumpriu todos os prazos acordados.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'carlos.mendes@email.com'), 4, 'Resolveu o vazamento rapidamente e com preço justo.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'ana.ferreira@email.com'), 5, 'Ana pintou minha casa e ficou linda! Trabalho muito caprichado.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'sofia.oliveira@email.com'), 5, 'Sofia é fantástica! Minha casa fica sempre impecável depois da limpeza.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'sofia.oliveira@email.com'), 5, 'Serviço de limpeza excepcional, muito detalhista e cuidadosa.', gen_random_uuid()),
((SELECT id FROM public.professionals WHERE email = 'luisa.pereira@email.com'), 5, 'Luísa configurou minha rede sem fio perfeitamente. Muito técnica e profissional.', gen_random_uuid());
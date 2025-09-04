-- Adicionar apenas profissionais de exemplo (sem avaliações para evitar problemas de FK)

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
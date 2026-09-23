-- Seed content (all editable from admin panel)
INSERT OR REPLACE INTO content (key, value) VALUES
('homepage', '{"heroEyebrow":"Premium Residential Developer","heroHeading":"Building Spaces. Creating Better Futures.","heroDescription":"Premium residential spaces designed with quality, comfort and modern living in mind.","heroImage":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2000&q=80","primaryBtnText":"Explore Projects","primaryBtnLink":"/projects","secondaryBtnText":"Schedule a Site Visit","secondaryBtnLink":"/contact"}'),
('about', '{"heading":"Built on quality. Guided by trust.","description":"MJ Developers creates premium residential spaces designed with care, craftsmanship and long-term value.","fullDescription":"For years, MJ Developers has been creating homes that families are proud to live in. Every project is designed with intention — from the quality of materials to the flow of natural light, from structural integrity to everyday comfort.\\n\\nOur approach combines thoughtful design, transparent communication and disciplined execution. We build not just apartments, but addresses that age well and communities that thrive.","image":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80"}'),
('owner', '{"name":"Owner Name — Placeholder","designation":"Founder & Managing Director","message":"Our vision is to create spaces that combine quality construction, thoughtful design and comfortable living.","photo":"https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&q=80"}'),
('team', '{"caption":"Driven by people. Built on trust.","description":"Our team brings together engineers, architects and project managers united by one goal — building homes that stand the test of time.","photo":"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2000&q=80"}'),
('stats', '{"delivered":"12","ongoing":"4","years":"15","families":"850"}'),
('constructionContent', '{"heading":"Precision in every stage.","intro":"From foundation to finishing, our construction follows strict quality checks, professional planning and modern methods to deliver homes that last."}'),
('cta', '{"heading":"Let''s Build Your Future Together","description":"Talk to our team about availability, pricing or a personalised site visit.","primaryBtnText":"Schedule a Site Visit","secondaryBtnText":"Contact Us","backgroundImage":"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=2000&q=80"}'),
('features', '[{"title":"Quality Construction","description":"Certified materials and disciplined engineering across every project."},{"title":"Transparent Process","description":"Clear pricing, honest timelines and open communication throughout."},{"title":"Modern Design","description":"Thoughtful layouts and contemporary architecture for modern living."},{"title":"Prime Locations","description":"Well-connected addresses chosen for convenience and long-term value."},{"title":"Customer Focus","description":"Every decision is made with the resident''s comfort in mind."},{"title":"Long-Term Value","description":"Homes designed and built to appreciate and endure."}]'),
('contact', '{"address":"MJ Developers, Corporate Office, Your City, India","phone":"+91 00000 00000","email":"hello@mjdevelopers.example","whatsapp":"+91 00000 00000","hours":"Mon – Sat · 9:30 AM – 6:30 PM","map_embed":"","social":{"instagram":"","facebook":"","youtube":"","linkedin":"","twitter":""}}'),
('seo', '{"homeTitle":"MJ Developers — Premium Residential Apartments","homeDescription":"Premium residential spaces designed with quality, comfort and modern living in mind.","ogImage":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"}'),
('settings', '{"siteName":"MJ Developers","siteUrl":"https://mjdevelopers.example","logo":"","footerDescription":"Building premium residential spaces with quality construction, thoughtful design and comfortable modern living."}');

INSERT OR REPLACE INTO amenities (id, name, description, sort_order) VALUES
(1, 'Covered Parking', 'Dedicated parking for residents and guests.', 1),
(2, '24×7 Security', 'Round-the-clock security personnel and controlled access.', 2),
(3, 'CCTV Surveillance', 'Comprehensive camera coverage across common areas.', 3),
(4, 'High-Speed Elevators', 'Reliable elevators for comfortable vertical movement.', 4),
(5, 'Landscaped Garden', 'Green spaces designed for calm and relaxation.', 5),
(6, 'Children''s Play Area', 'Safe, well-equipped play zone for kids.', 6),
(7, 'Power Backup', 'Full backup for common areas and essential services.', 7),
(8, 'Clubhouse', 'Community space for events and gatherings.', 8),
(9, 'Water Supply', 'Reliable supply with quality treatment systems.', 9);

INSERT OR REPLACE INTO testimonials (id, name, project, review, enabled, sort_order) VALUES
(1, 'Resident Name', 'MJ Residency', 'The team was professional and transparent throughout. Our home feels premium and thoughtfully built.', 1, 1),
(2, 'Resident Name', 'MJ Heights', 'Quality of construction and attention to detail exceeded our expectations.', 1, 2),
(3, 'Resident Name', 'MJ Residency', 'From booking to handover, the experience was smooth and reassuring.', 1, 3);

INSERT OR REPLACE INTO projects (id, name, slug, location, property_type, status, short_description, description, starting_price, bedrooms, area, possession, main_image, gallery, amenities, floor_plans, specifications, highlights, construction_status, progress, featured, published, sort_order) VALUES
(1, 'MJ Residency', 'mj-residency', 'City Center', 'Residential Apartments', 'Ongoing',
 'A premium residential development offering thoughtfully designed 2 & 3 BHK apartments.',
 'MJ Residency is our flagship residential project, blending modern architecture with generous open spaces. Each apartment is planned to maximise light, ventilation and everyday comfort.',
 '₹65 Lakh onwards', '2 & 3 BHK', '1200 – 1850 sq.ft', 'Dec 2026',
 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
 '[{"url":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80","alt":"Exterior view"},{"url":"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","alt":"Living room"}]',
 '["Covered Parking","24×7 Security","CCTV Surveillance","High-Speed Elevators","Landscaped Garden","Clubhouse"]',
 '[{"title":"2 BHK","area":"1200 sq.ft","description":"Efficient layout with balcony.","image":"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"},{"title":"3 BHK","area":"1850 sq.ft","description":"Spacious, corner-facing unit.","image":"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"}]',
 '["RCC framed structure","Vitrified tile flooring","Modular kitchen provision","Concealed copper wiring","Branded sanitary fittings"]',
 '["Prime central location","Over 60% open space","Vaastu-compliant layouts","Quality construction"]',
 'Structure complete — finishing in progress', 62, 1, 1, 1),
(2, 'MJ Heights', 'mj-heights', 'Suburban Boulevard', 'Residential Apartments', 'Ongoing',
 'A modern residential tower offering premium 3 BHK apartments with skyline views.',
 'MJ Heights is designed for those who value both privacy and connection. Spacious apartments, elegant common areas and an elevated lifestyle experience.',
 '₹85 Lakh onwards', '3 BHK', '1650 – 2100 sq.ft', 'Jun 2027',
 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
 '[{"url":"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80","alt":"Tower view"}]',
 '["Covered Parking","24×7 Security","Elevator","Power Backup","Clubhouse"]',
 '[]',
 '["RCC framed structure","Premium flooring","Designer bathrooms"]',
 '["Skyline views","Premium specifications","Centrally located"]',
 'Structure in progress', 38, 1, 1, 2),
(3, 'MJ Greens', 'mj-greens', 'Lake District', 'Residential Apartments', 'Completed',
 'A peaceful residential community surrounded by greenery, now fully occupied.',
 'MJ Greens delivered on time and to specification — a lasting neighbourhood built on trust and quality.',
 '₹55 Lakh onwards', '2 BHK', '1050 – 1400 sq.ft', 'Delivered',
 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600&q=80',
 '[]', '["Parking","Security","Garden"]', '[]', '[]', '["On-time delivery","High resident satisfaction"]',
 'Completed', 100, 0, 1, 3);

INSERT OR REPLACE INTO gallery (id, url, title, alt_text, category, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80', 'MJ Residency — Exterior', 'MJ Residency exterior', 'Projects', 1),
(2, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80', 'MJ Heights', 'MJ Heights tower', 'Projects', 2),
(3, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80', 'Site Progress', 'Construction site', 'Construction', 3),
(4, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80', 'Interior', 'Living room interior', 'Apartments', 4),
(5, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80', 'Our Team', 'Team group photo', 'Team', 5),
(6, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80', 'Event', 'Company event', 'Events', 6);

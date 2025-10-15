-- Just import genres (no ON CONFLICT)
INSERT INTO public.genres (name) VALUES
('Deathcore'), ('Metal'), ('Hardcore'), ('Metalcore'), ('Doom Metal'),
('Experimental'), ('Indie Rock'), ('Post-Hardcore'), ('Math Rock'), ('Jazz-Core'),
('Pop'), ('Rock'), ('Alternative'), ('Hardcore Punk'), ('Straight Edge'),
('Indie Pop'), ('Folk Pop'), ('New Wave'), ('Pop Rock'), ('Garage Rock'),
('Hard Rock'), ('Ska'), ('Punk'), ('Funk'), ('Soul'), ('Emo'),
('Power Pop'), ('Grindcore'), ('Hip-Hop');

SELECT COUNT(*) as total_genres FROM public.genres;

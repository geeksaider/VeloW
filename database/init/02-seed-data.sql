-- Use the velo database
USE velo;

-- Insert sample products with paintings and art focus in English
INSERT INTO products (title, description, price, image_url, category) VALUES
-- Paintings Category - Abstract Art
('Abstract Horizon', 'Vibrant abstract painting with dynamic colors that create an impression of a sunset horizon. Hand-painted on canvas with acrylic paints.', 249.99, '/uploads/painting-abstract-1.jpg', 'Paintings'),
('Blue Serenity', 'Calming blue abstract composition with gentle brush strokes that evoke the feeling of water and waves. Perfect for bedrooms and meditation spaces.', 189.99, '/uploads/painting-abstract-2.jpg', 'Paintings'),
('Urban Chaos', 'Bold abstract art piece with geometric shapes and contrasting colors representing the energy of city life. Framed in sleek black wood.', 299.99, '/uploads/painting-abstract-3.jpg', 'Paintings'),
('Color Symphony', 'Harmonious blend of colors in an abstract pattern that creates visual interest from any angle. Large-scale canvas that becomes a focal point.', 349.99, '/uploads/painting-abstract-4.jpg', 'Paintings'),
('Geometric Dreams', 'Modern abstract painting featuring precise geometric patterns in a minimalist color palette. Mounted on high-quality canvas.', 279.99, '/uploads/painting-abstract-5.jpg', 'Paintings'),
('Emotional Waves', 'Expressive abstract painting with fluid forms and emotional color transitions. Created with a unique palette knife technique.', 229.99, '/uploads/painting-abstract-6.jpg', 'Paintings'),
('Industrial Abstract', 'Contemporary abstract painting with metallic accents and rough textures inspired by industrial architecture. Museum-quality finish.', 319.99, '/uploads/painting-abstract-7.jpg', 'Paintings'),
('Minimalist Composition', 'Clean lines and subtle color variations define this minimalist abstract piece. Perfect for modern interiors.', 199.99, '/uploads/painting-abstract-8.jpg', 'Paintings'),
('Cosmic Imagination', 'Abstract representation of cosmic elements with deep blues and purples accented with metallic gold details. Gallery-wrapped canvas.', 269.99, '/uploads/painting-abstract-9.jpg', 'Paintings'),
('Emotional Landscape', 'Abstract landscape-inspired composition with horizon lines and atmospheric color gradients. Professionally framed.', 289.99, '/uploads/painting-abstract-10.jpg', 'Paintings'),

-- Paintings Category - Landscape Art
('Mountain Serenity', 'Realistic landscape painting of mountain ranges at sunset with detailed pine forests and reflective lake surface. Framed in rustic wood.', 359.99, '/uploads/painting-landscape-1.jpg', 'Paintings'),
('Coastal Dreams', 'Serene coastal landscape with crashing waves and dramatic cliffs. Perfect for bringing a sense of nature into your home.', 329.99, '/uploads/painting-landscape-2.jpg', 'Paintings'),
('Autumn Forest', 'Vibrant landscape depicting a forest path in peak autumn colors. Rich orange and red tones create a warm atmosphere.', 279.99, '/uploads/painting-landscape-3.jpg', 'Paintings'),
('Tuscan Countryside', 'Idyllic painting of the Tuscan landscape with rolling hills, cypress trees, and traditional farmhouses. Mediterranean charm for your walls.', 399.99, '/uploads/painting-landscape-4.jpg', 'Paintings'),
('Lavender Fields', 'Picturesque purple lavender fields extending to the horizon under a clear blue sky. Brings the scent of Provence to mind.', 249.99, '/uploads/painting-landscape-5.jpg', 'Paintings'),
('Alpine Lake', 'Breathtaking mountain lake scene with crystal clear water reflecting snow-capped peaks. Meticulous attention to detail.', 379.99, '/uploads/painting-landscape-6.jpg', 'Paintings'),
('Desert Sunset', 'Dramatic desert landscape with iconic cacti silhouettes against a vibrant orange and purple sunset sky. Southwestern art style.', 229.99, '/uploads/painting-landscape-7.jpg', 'Paintings'),
('Cherry Blossom Path', 'Romantic path lined with blooming cherry trees with delicate pink petals. Impressionist style with soft brush strokes.', 259.99, '/uploads/painting-landscape-8.jpg', 'Paintings'),
('Tropical Paradise', 'Vivid depiction of a tropical beach with turquoise water, white sand, and palm trees. Escape to paradise with this artwork.', 299.99, '/uploads/painting-landscape-9.jpg', 'Paintings'),
('Winter Wonderland', 'Peaceful snow-covered forest scene with a winding river and distant cabin emitting warm light. Evokes cozy winter feelings.', 289.99, '/uploads/painting-landscape-10.jpg', 'Paintings'),

-- Paintings Category - Portrait Art
('Vintage Portrait', 'Elegant portrait in classical style with renaissance-inspired lighting and composition. Ornate gold frame included.', 499.99, '/uploads/painting-portrait-1.jpg', 'Paintings'),
('Modern Beauty', 'Contemporary portrait with bold colors and unique style. Abstract elements combine with realistic features for a stunning effect.', 389.99, '/uploads/painting-portrait-2.jpg', 'Paintings'),
('Character Study', 'Expressive portrait focusing on character and emotion through detailed rendering of facial features. Museum-quality printing.', 349.99, '/uploads/painting-portrait-3.jpg', 'Paintings'),
('Historical Figure', 'Masterful recreation of a historical portrait with attention to period-appropriate styling and techniques. Educational and decorative.', 459.99, '/uploads/painting-portrait-4.jpg', 'Paintings'),
('Pop Art Portrait', 'Vibrant pop art style portrait with bold outlines and contrasting colors inspired by Warhol. Contemporary statement piece.', 299.99, '/uploads/painting-portrait-5.jpg', 'Paintings'),
('Impressionist Portrait', 'Soft, impressionist-style portrait with delicate brush strokes capturing light and atmosphere. Evokes a dreamy quality.', 379.99, '/uploads/painting-portrait-6.jpg', 'Paintings'),
('Minimalist Portrait', 'Striking portrait created with minimal lines and selective color. Demonstrates how little is needed to capture essence.', 259.99, '/uploads/painting-portrait-7.jpg', 'Paintings'),
('Cultural Portrait', 'Richly detailed portrait celebrating cultural heritage through traditional clothing and symbolic elements. Conversation starter.', 429.99, '/uploads/painting-portrait-8.jpg', 'Paintings'),
('Family Portrait', 'Commissioned-style family portrait with balanced composition and warm tones. Perfect for family spaces.', 399.99, '/uploads/painting-portrait-9.jpg', 'Paintings'),
('Self Reflection', 'Thought-provoking self-portrait exploring identity through symbolic elements and expressive style. Gallery-quality print.', 329.99, '/uploads/painting-portrait-10.jpg', 'Paintings'),

-- Paintings Category - Still Life Art
('Classic Fruit Arrangement', 'Traditional still life painting of fruit arranged on a draped table with dramatic lighting reminiscent of Dutch masters.', 279.99, '/uploads/painting-stilllife-1.jpg', 'Paintings'),
('Modern Botanicals', 'Contemporary still life featuring botanical elements with a clean, minimalist approach and negative space. Gallery wrapped.', 249.99, '/uploads/painting-stilllife-2.jpg', 'Paintings'),
('Vintage Books', 'Nostalgic still life of antique books, writing implements, and reading glasses. Perfect for home libraries or studies.', 229.99, '/uploads/painting-stilllife-3.jpg', 'Paintings'),
('Wine and Cheese', 'Elegant still life depicting fine wine, artisanal cheese, and grapes. Ideal for dining rooms or kitchen décor.', 269.99, '/uploads/painting-stilllife-4.jpg', 'Paintings'),
('Flower Arrangement', 'Vibrant floral still life with detailed rendering of various flowers in a decorative vase. Brings perpetual spring to any room.', 239.99, '/uploads/painting-stilllife-5.jpg', 'Paintings'),

-- Wall Art Category
('Metal Wall Sculpture', 'Contemporary metal wall art with geometric patterns that create stunning shadow effects. Handcrafted from brushed aluminum.', 189.99, '/uploads/wallart-1.jpg', 'Wall Art'),
('Wooden World Map', 'Intricate wooden world map wall art with multi-layered design and natural wood grain variations. Available in multiple sizes.', 249.99, '/uploads/wallart-2.jpg', 'Wall Art'),
('Macramé Wall Hanging', 'Handcrafted macramé wall hanging made from 100% cotton rope with wooden dowel. Adds texture and bohemian charm.', 129.99, '/uploads/wallart-3.jpg', 'Wall Art'),
('Canvas Print Set', 'Set of three coordinating canvas prints with nature-inspired imagery. Perfect for creating a gallery wall.', 199.99, '/uploads/wallart-4.jpg', 'Wall Art'),
('Acoustic Wall Panels', 'Decorative acoustic wall panels that reduce noise while adding visual interest. Geometric patterns in customizable colors.', 159.99, '/uploads/wallart-5.jpg', 'Wall Art'),
('Neon Light Art', 'Custom LED neon wall art with inspirational phrase. Energy-efficient alternative to traditional neon with same visual impact.', 179.99, '/uploads/wallart-6.jpg', 'Wall Art'),
('3D Geometric Wall Art', 'Three-dimensional geometric wall sculpture with layered elements creating depth and shadow. Modern statement piece.', 159.99, '/uploads/wallart-7.jpg', 'Wall Art'),
('Floating Shelves with Art', 'Combination of functional floating shelves and integrated artwork. Perfect for displaying small items while adding visual interest.', 139.99, '/uploads/wallart-8.jpg', 'Wall Art'),
('Tapestry Wall Hanging', 'Large fabric tapestry with intricate designs inspired by global patterns. Adds color, texture, and improves acoustics.', 89.99, '/uploads/wallart-9.jpg', 'Wall Art'),
('Mirror Art Installation', 'Artistic arrangement of mirrors in various shapes that creates an eye-catching reflection pattern. Modern and functional.', 219.99, '/uploads/wallart-10.jpg', 'Wall Art'),

-- Photography Category
('Urban Architecture', 'Black and white photograph of iconic city architecture highlighting geometric patterns and dramatic perspective.', 179.99, '/uploads/photo-1.jpg', 'Photography'),
('Wildlife Close-up', 'Stunning wildlife photography capturing the intense gaze of a wild predator. Professional quality print on metallic paper.', 199.99, '/uploads/photo-2.jpg', 'Photography'),
('Abstract Aerial View', 'Captivating aerial photography of natural landscapes that create abstract patterns when viewed from above.', 229.99, '/uploads/photo-3.jpg', 'Photography'),
('Ocean Waves', 'Mesmerizing long-exposure photograph of ocean waves creating smooth, silky water textures. Calming blue tones.', 169.99, '/uploads/photo-4.jpg', 'Photography'),
('Street Photography', 'Candid street photography capturing everyday moments with extraordinary composition. Black and white with selective color.', 159.99, '/uploads/photo-5.jpg', 'Photography'),
('Night Sky', 'Astrophotography showing the Milky Way over a dramatic landscape. Stars and cosmic details captured with precision.', 249.99, '/uploads/photo-6.jpg', 'Photography'),
('Minimalist Nature', 'Minimalist approach to nature photography with simple compositions and negative space. Zen-inspired aesthetic.', 149.99, '/uploads/photo-7.jpg', 'Photography'),
('Vintage Travel', 'Nostalgic travel photography with retro color grading reminiscent of vintage postcards. Series of famous landmarks.', 189.99, '/uploads/photo-8.jpg', 'Photography'),
('Macro Nature', 'Extreme close-up photography revealing the hidden details of natural elements like water droplets on spider webs.', 169.99, '/uploads/photo-9.jpg', 'Photography'),
('Industrial Decay', 'Atmospheric photography of abandoned industrial spaces with rich textures and haunting beauty. Limited edition prints.', 209.99, '/uploads/photo-10.jpg', 'Photography'),

-- Sculptures Category
('Abstract Marble Sculpture', 'Elegant abstract sculpture hand-carved from genuine marble. Each piece features unique natural veining patterns.', 499.99, '/uploads/sculpture-1.jpg', 'Sculptures'),
('Bronze Figure', 'Classical bronze sculpture depicting human form in motion. Traditional lost-wax casting method with patina finish.', 599.99, '/uploads/sculpture-2.jpg', 'Sculptures'),
('Modern Wood Carving', 'Contemporary sculpture carved from sustainable hardwood with flowing organic forms. Natural finish highlights wood grain.', 349.99, '/uploads/sculpture-3.jpg', 'Sculptures'),
('Glass Art Object', 'Hand-blown glass sculpture with swirling colors and translucent effects. Catches and plays with light beautifully.', 429.99, '/uploads/sculpture-4.jpg', 'Sculptures'),
('Mixed Media Assemblage', 'Thought-provoking sculpture created from found objects and repurposed materials. Sustainable art with unique character.', 299.99, '/uploads/sculpture-5.jpg', 'Sculptures'),
('Minimalist Stone Sculpture', 'Reductive stone sculpture with smooth surfaces and essential forms. Inspired by modernist sculptors like Brancusi.', 459.99, '/uploads/sculpture-6.jpg', 'Sculptures'),
('Ceramic Art Piece', 'Hand-formed ceramic sculpture with experimental glazing techniques creating one-of-a-kind surface effects.', 259.99, '/uploads/sculpture-7.jpg', 'Sculptures'),
('Metal Wire Sculpture', 'Delicate yet strong sculpture created by bending and shaping metal wire into three-dimensional drawings in space.', 219.99, '/uploads/sculpture-8.jpg', 'Sculptures'),
('Kinetic Sculpture', 'Interactive sculpture with elements that move with air currents, creating ever-changing compositions and gentle motion.', 379.99, '/uploads/sculpture-9.jpg', 'Sculptures'),
('Textural Wall Sculpture', 'Three-dimensional wall-mounted sculpture with rich textural elements creating shadows and depth. Indoor/outdoor safe.', 329.99, '/uploads/sculpture-10.jpg', 'Sculptures'),

-- Prints Category
('Limited Edition Art Print', 'Numbered limited edition print with certificate of authenticity. Museum-quality archival inks on acid-free paper.', 149.99, '/uploads/print-1.jpg', 'Prints'),
('Vintage Reproduction', 'High-quality reproduction of vintage advertising art from the early 20th century. Retro charm for modern spaces.', 89.99, '/uploads/print-2.jpg', 'Prints'),
('Botanical Illustration', 'Detailed botanical illustration printed with archival inks. Scientific accuracy meets artistic beauty.', 79.99, '/uploads/print-3.jpg', 'Prints'),
('Typography Art', 'Inspiring quote rendered in creative typography. Perfect for office or motivational spaces.', 69.99, '/uploads/print-4.jpg', 'Prints'),
('Japanese Woodblock Print', 'Faithful reproduction of traditional Japanese woodblock print. Historical art for contemporary spaces.', 99.99, '/uploads/print-5.jpg', 'Prints'),
('Architectural Drawing', 'Precise architectural drawing highlighting the beauty of famous buildings. Technical accuracy with artistic presentation.', 89.99, '/uploads/print-6.jpg', 'Prints'),
('Digital Art Print', 'Contemporary digital art printed on high-quality media. Vibrant colors that pop with modern design.', 79.99, '/uploads/print-7.jpg', 'Prints'),
('Abstract Pattern', 'Geometric pattern print with harmonious color combinations. Adds visual texture to any room.', 59.99, '/uploads/print-8.jpg', 'Prints'),
('Movie Poster', 'Stylized alternative movie poster designed by independent artists. Collector's item for film enthusiasts.', 69.99, '/uploads/print-9.jpg', 'Prints'),
('Children's Illustration', 'Whimsical illustration perfect for nurseries and children's rooms. Playful design with gentle colors.', 49.99, '/uploads/print-10.jpg', 'Prints'),

-- Frames & Display Category
('Floating Frame', 'Minimalist floating frame that creates the illusion of artwork suspended in space. Available in multiple sizes.', 59.99, '/uploads/frame-1.jpg', 'Frames'),
('Ornate Gold Frame', 'Elaborate gold-finished frame with intricate detailing reminiscent of antique picture frames. Makes any art look prestigious.', 89.99, '/uploads/frame-2.jpg', 'Frames'),
('Natural Wood Frame', 'Sustainable wood frame with visible grain and natural finish. Complements organic and nature-inspired art.', 49.99, '/uploads/frame-3.jpg', 'Frames'),
('Metal Gallery Frame', 'Contemporary thin metal frame in matte black. Museum-style presentation with clean lines.', 39.99, '/uploads/frame-4.jpg', 'Frames'),
('Display Easel', 'Adjustable wooden easel for displaying artwork or photographs. Folds flat for storage when not in use.', 79.99, '/uploads/frame-5.jpg', 'Frames'),
('Shadow Box Frame', 'Deep shadow box frame for displaying three-dimensional objects or creating layered art compositions.', 69.99, '/uploads/frame-6.jpg', 'Frames'),
('Picture Ledge', 'Floating shelf designed specifically for leaning and layering framed artwork. Easy to rearrange displays.', 49.99, '/uploads/frame-7.jpg', 'Frames'),
('Digital Art Frame', 'Digital display designed specifically for art with customizable settings and anti-glare screen. Includes rotating art subscription.', 199.99, '/uploads/frame-8.jpg', 'Frames'),
('Clip Frames Set', 'Set of minimalist glass clip frames that let the art be the focus. Perfect for temporary displays and frequent changes.', 39.99, '/uploads/frame-9.jpg', 'Frames'),
('Gallery Wall Set', 'Curated set of frames in complementary styles for creating a cohesive gallery wall. Includes hanging template.', 129.99, '/uploads/frame-10.jpg', 'Frames');

-- Create a sample user (password: password123)
INSERT INTO users (email, password_hash) VALUES
('user@example.com', '$2b$10$9QVXgSIU5n/1Xp5b7BM2C.KzAOAaCPjuTZJRJA5OlGJheJ.mvXv7i');

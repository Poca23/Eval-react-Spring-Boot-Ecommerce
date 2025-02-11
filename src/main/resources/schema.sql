-- Création de la table PRODUCT
CREATE TABLE IF NOT EXISTS product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    stock INT NOT NULL CHECK (stock >= 0),
    description TEXT,
    image_url VARCHAR(255)
);

-- Création de la table ORDER
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL
);

-- Création de la table ORDER_ITEM
CREATE TABLE IF NOT EXISTS order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Suppression des données existantes avant réinsertion
DELETE FROM order_item;
DELETE FROM orders;
DELETE FROM product;

-- Insertion de produits de test
INSERT INTO product (name, price, stock, description, image_url) VALUES
('iPhone 24', 2999.99, 50, 'Dernier modèle d''iPhone avec appareil photo avancé  et brosse à dent intégrée', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5'),
('Samsung Galaxy S48', 1999.99, 45, 'Smartphone Android haut de gamme avec pochette plastifiée', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf'),
('MacBook Pro Plus Plus', 3001.99, 30, 'Ordinateur portable Apple 14 pouces et gant tactile', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8'),
('AirPods super Pro 8', 549.99, 100, 'Écouteurs sans fil avec réduction de bruit surtout pour les bêtises', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434');

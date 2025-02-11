J'ai déjà le script sql, son fichier est dans resources, voici son contenu :
-- Création de la table PRODUCT
CREATE TABLE product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    description TEXT
);

-- Création de la table ORDER
CREATE TABLE orders ( -- 'order' est un mot réservé en SQL, donc on utilise 'orders'
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL
);

-- Création de la table ORDER_ITEM
CREATE TABLE order_item (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Ajout des contraintes
ALTER TABLE product ADD CONSTRAINT check_stock_positive CHECK (stock >= 0);
ALTER TABLE product ADD CONSTRAINT check_price_positive CHECK (price > 0);
ALTER TABLE order_item ADD CONSTRAINT check_quantity_positive CHECK (quantity > 0);


-- Insertion de produits de test
INSERT INTO product (name, price, stock, description) VALUES
('iPhone 24', 2999.99, 50, 'Dernier modèle d''iPhone avec appareil photo avancé  et brosse à dent intégrée'),
('Samsung Galaxy S48', 1999.99, 45, 'Smartphone Android haut de gamme avec pochette plastifiée'),
('MacBook Pro Plus Plus', 3001.99, 30, 'Ordinateur portable Apple 14 pouces et gant tactile'),
('AirPods super Pro 8', 549.99, 100, 'Écouteurs sans fil avec réduction de bruit surtout pour les bêtises');


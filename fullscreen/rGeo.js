// Geometrical Shapes

class Vector2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    // Returns a new Vector2 (0, 0)
    static zero () { return new Vector2(0, 0); }

    // Returns a new Vector2 with random components -1 <= x <= 1
    static random () { return new Vector2(lerp(-1, 1, Math.random()), lerp(-1, 1, Math.random())); }

    // Returns a new Vector2 with random components 0 <= x < 1
    static randomPos () { return new Vector2(Math.random(), Math.random()); }

    static fromMouse () { return new Vector2(mouseX, mouseY); }

    // Returns the Vectors angle.
    get angle () { return atan2(this.y, this.x); }

    // Returns the Vectors magnitude.
    get mag () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2), 2); }

    // Returns a Vector2 that is the same as this one.
    copy () { return new Vector2(this.x, this.y); }

    // Sets the Vectors magnitude to 1.
    toUnit () {
        this.div(this.mag);

        return this;
    }

    // Sets the Vectors magnitude to t.
    setMag (t) {
        this.toUnit().mult(t);

        return this;
    }

    // Clamps the magnitude of the Vector2 to m.
    limit (m) {
        if (this.mag > m) this.setMag(m);

        return this;
    }

    dist (other) {
        if (other instanceof Vector2) {
            let dif = this.copy().sub(other);
            
            return Math.sqrt( Math.pow(dif.x, 2) + Math.pow(dif.y, 2) );
        } else console.error(`Unknown type.`, typeof other, other);
    }

    // Adds another object to the Vector2.
    add (other) {
        if (other instanceof Vector2) {
            this.x += other.x;
            this.y += other.y;

            return this;
        } else if (typeof other === `number`) {
            this.x += other;
            this.y += other;

            return this;
        }
        
        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }

    static add (a, b) {
        if (a instanceof Vector2) return a.copy().add(b);
        else if (b instanceof Vector2) return b.copy().add(a);

        console.error(`Unknown type.`, typeof a, a, typeof b, b);
        debugger;
    }

    sub (other) {
        if (other instanceof Vector2) {
            this.x -= other.x;
            this.y -= other.y;

            return this;
        } else if (typeof other === `number`) {
            this.x -= other;
            this.y -= other;

            return this;
        }
        
        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }

    static sub (a, b) {
        if (a instanceof Vector2) return a.copy().sub(b);

        console.error(`Unknown type.`, typeof a, a, typeof b, b);
        debugger;
    }

    mult (other) {
        if (other instanceof Vector2) {
            this.x *= other.x;
            this.y *= other.y;

            return this;
        } else if (typeof other === `number`) {
            this.x *= other;
            this.y *= other;

            return this;
        } else console.error(`Unknown type.`, typeof other, other);
    }

    div (other) {
        if (other instanceof Vector2) {
            this.x /= other.x;
            this.y /= other.y;

            return this;
        } else if (typeof other === `number`) {
            this.x /= other;
            this.y /= other;

            return this;
        }
        
        console.error(`Uknown type.`, typeof other, other);
        debugger;
    }

    gt (other) {
        if (other instanceof Vector2) return this.x > other.x && this.y > other.y;

        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }

    lt (other) {
        if (other instanceof Vector2) return this.x < other.x && this.y < other.y;

        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }
}

class Rect {
    constructor (pos, size) {
        this.pos = pos;
        this.size = size;
    }

    get points () {
        return [
            this.pos.copy(), new Vector2(this.pos.x + this.size.x, this.pos.y),
            new Vector2( this.pos.x, this.pos.y + this.size.y ), Vector2.add(this.pos, this.size),
        ];
    }

    // Returns a new Rect with the same properties.
    copy () { return new Rect(this.pos.copy(), this.size.copy()); }

    // Returns true if other is fully contained in this.
    contains (other) {
        if (other instanceof Vector2) {
            return (
                other.gt(this.pos) &&
                other.lt( Vector2.add(this.pos, this.size) )
            );
        }

        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }

    intersects (other) {
        if (other instanceof Circle) {
            let circle = {
                x: other.pos.x,
                y: other.pos.y,
            };

            let op = this.points;
            let rect = {
                p1: op[0],
                p2: op[3],
            };
            
            let testX = circle.x;
            let testY = circle.y;

            if (circle.x < rect.p1.x) testX = rect.p1.x;
            else if (circle.x > rect.p2.x) testX = rect.p2.x;

            if (circle.y < rect.p1.y) testY = rect.p1.y;
            else if (circle.y > rect.p2.y) testY = rect.p2.y;

            let dist = other.pos.dist( new Vector2(testX, testY) );
            return dist <= other.radius;
        }


        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }
}

class Circle {
    constructor (pos, radius) {
        this.pos = pos;
        this.radius = radius;
    }

    // Returns a new Circle with the same properties.
    copy () { return new Circle( this.pos.copy(), this.radius ); }

    contains (other) {
        if (other instanceof Vector2) {
            return (this.pos.dist(other) <= this.radius);
        }

        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }

    intersect (other) {
        if (other instanceof Rect) {
            let circle = {
                x: this.pos.x,
                y: this.pos.y,
            };

            let op = other.points;
            let rect = {
                p1: op[0],
                p2: op[3],
            };
            
            let testX = this.pos.x;
            let testY = this.pos.y;

            if (circle.x < rect.p1.x) testX = rect.p1.x;
            else if (circle.x > rect.p2.x) textX = rect.p2.x;

            if (circle.y < rect.p1.y) testY = rect.p1.y;
            else if (circle.y > rect.p2.y) testY = rect.p2.y;

            let dist = this.pos.dist( new Vector2(testX, testY) );
            return dist <= this.radius;
        }

        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }
}

// Constructs

class Color {
    static get black () { return color(0); }
    static get gray () { return color(128); }
    static get white () { return colors(255); }
}

class QuadTree {
    constructor (area, capacity, getFunction) {
        this.area = area;
        this.capacity = capacity;

        this.points = [];
        this.quarters = [];

        this.getFunction = getFunction ?? (obj => obj);
    }

    divide () {
        let quarter = this.area.copy();
        quarter.size.div(2);

        let nw = quarter.copy();
        nw = new QuadTree(nw, this.capacity, this.getFunction);

        let ne = quarter.copy();
        ne.pos.add(new Vector2( quarter.size.x, 0 ));
        ne = new QuadTree(ne, this.capacity, this.getFunction);

        let sw = quarter.copy();
        sw.pos.add(new Vector2( 0, quarter.size.y ));
        sw = new QuadTree(sw, this.capacity, this.getFunction);

        let se = quarter.copy();
        se.pos.add(quarter.size);
        se = new QuadTree(se, this.capacity, this.getFunction);

        this.quarters = [nw, ne, sw, se];
    }

    insert (other) {
        let otherPos = this.getFunction(other);

        if (otherPos instanceof Vector2) {
            if (!this.area.contains(otherPos)) return false;

            if (this.points.length < this.capacity) {
                this.points.push(other);
                return true;
            } else {
                // We need to divide.
                if (this.quarters.length === 0) this.divide();

                for (let quarter of this.quarters) {
                    if ( quarter.insert(other) ) return true;
                }
            }

            return false;
        }

        console.error(`Unknown type.`, typeof other, other);
        debugger;
    }

    query (range, found = []) {
        if (!this.area.intersects(range)) return [];

        found.push(
            ...this.points
                .filter(point => range.contains(this.getFunction(point)))
        );
        
        for (let quarter of this.quarters) {
            quarter.query(range, found);
        }

        return found;
    }

    draw () {
        rect(
            this.area.pos.x, this.area.pos.y,
            this.area.size.x, this.area.size.y
        );
        
        for (let p of this.points.map(x => this.getFunction(x)))
            point(p.x, p.y);

        for (let quarter of this.quarters) quarter.draw();
    }
}
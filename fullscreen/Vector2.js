/*
*/

class Vector2 {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    // Returns a new Vector2 (0, 0)
    static zero () { return new Vector2(0, 0); }

    // Returns a new Vector2 with random components 0 <= x < 1
    // static random () { return new Vector2(Math.random(), Math.random()); }
    static random () { return new Vector2(lerp(-1, 1, Math.random()), lerp(-1, 1, Math.random())); }

    // Returns the Vectors angle.
    get angle () { return atan2(this.y / this.x); }

    // Returns the Vectors magnitude.
    get mag () { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2), 2); }

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
        } else console.error(`Unknown type.`, typeof other, other);
    }    

    // Sub

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
        } else if (typeof other === `number`) {
            this.x /= other;
            this.y /= other;
        } else console.error(`Uknown type.`, typeof other, other);
    }
}
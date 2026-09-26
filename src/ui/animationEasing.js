// AI generated

/**
 * Recreation of the CSS cubic-bezier.
 * @param {number} x1 - X do primeiro ponto de controle (0 a 1)
 * @param {number} y1 - Y do primeiro ponto de controle
 * @param {number} x2 - X do segundo ponto de controle (0 a 1)
 * @param {number} y2 - Y do segundo ponto de controle
 * @returns {function(number): number} Uma função que aceita o tempo (0 a 1) e retorna o progresso (0 a 1)
 */
export function cubicBezier(x1, y1, x2, y2) {
    const getCoord = (t, p1, p2) => {
        return 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3);
    };

    const getSlope = (t, p1, p2) => {
        return 3 * Math.pow(1 - t, 2) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * Math.pow(t, 2) * (1 - p2);
    };

    const getTForX = (xTarget) => {
        let t = xTarget; // Chute inicial
        
        for (let i = 0; i < 8; i++) {
            const currentX = getCoord(t, x1, x2) - xTarget;
            const slope = getSlope(t, x1, x2);
            if (Math.abs(slope) < 1e-6) break;
            t -= currentX / slope;
        }
        
        let lower = 0, upper = 1;
        while (Math.abs(getCoord(t, x1, x2) - xTarget) > 1e-4) {
            if (getCoord(t, x1, x2) > xTarget) upper = t;
            else lower = t;
            t = (upper + lower) / 2;
        }
        return t;
    };

    return function(time) {
        if (time <= 0) return 0;
        if (time >= 1) return 1;
        
        const t = getTForX(time);
        
        return getCoord(t, y1, y2);
    };
}

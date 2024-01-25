// script.js

import { db } from "./db.server";
import { generate } from "random-words";

function generateRandomGradient(colors) {
    // Customize this function based on your gradient requirements// 50% chance of linear or radial gradient
    if (colors.length <= 1) {
        return `${colors.join(' ')}`
    }

    const angle = Math.floor(Math.random() * 180);

    return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
}

function generateGlow(colors) {
    const chooseShadow = Math.random() < 0.99 ? true : false;

    if (colors.length > 0 && chooseShadow && colors.length < 2) {
        const glowIntensity = 6;
        const blur = colors.length * glowIntensity;

        console.log(`0 0 ${blur}px ${colors[0]}`)

        return `0 0 ${blur}px ${colors[0]}`;
    }

    return ""

}

function generateRandomColors(rarity) {
    const rarityRanges = {
        "Factory New": { min: 1, max: 2 },
        "Field-Tested": { min: 3, max: 4 },
        "Well-Worn": { min: 5, max: 10 },
        "Battle-Scarred": { min: 7, max: 11 },
    };

    // Generate a random number of colors within the range for the given rarity.
    const numColors = Math.floor(Math.random() * (rarityRanges[rarity].max - rarityRanges[rarity].min + 1)) + rarityRanges[rarity].min;

    const colors = [];
    for (let i = 0; i < numColors; i++) {
        // Generate a random hex color
        const hexColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        colors.push(hexColor);
    }
    return colors;
}

function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getCondition(colorCount, gradientType, textGlow) {
    if (colorCount === 1) {
        return "Factory New";
    } else if (colorCount === 2 || gradientType === "radial" || textGlow) {
        return "Factory New";
    } else if (colorCount <= 4) {
        return "Field-Tested";
    } else if (colorCount <= 6) {
        return "Well-Worn";
    } else {
        return "Battle-Scarred";
    }
}

function calculateFloatModifier(condition, colorCount, softness, glow) {
    const conditionRanges = {
        "glowAnd1Color": { min: 0.0000, max: 0.000000050 },
        "glow": { min: 0.0000, max: 0.00000100 },
        "Factory New": { min: 0.0000, max: 0.0003 },
        "Field-Tested": { min: 0.08, max: 0.15 },
        "Well-Worn": { min: 0.16, max: 0.25 },
        "Battle-Scarred": { min: 0.26, max: 0.40 },
    };

    const baseFloat = getRandomFloat(conditionRanges[glow ? glow && colorCount === 1 ? "glowAnd1Color" : "glow" : condition].min, conditionRanges[glow ? glow && colorCount === 1 ? "glowAnd1Color" : "glow" : condition].max);

    // Final float value without adjustments
    let finalFloat = baseFloat;

    // Check if the float value is close to negative
    if (finalFloat > 0.00039) {
        // Adjustments based on color count
        const colorAdjustment = colorCount > 3 ? 0.01 : colorCount < 2 ? -0.01 : -0.01;

        const glowAdjustment = glow ? -0.01 : 0.0

        // Adjustments based on softness
        const softnessAdjustment = softness === "soft" ? -0.005 : 0.005;

        // Apply adjustments
        finalFloat += colorAdjustment + softnessAdjustment + glowAdjustment;
    }

    return finalFloat.toFixed(9);
}


function generateRandomTextDecoration(level) {
    const softness = Math.random(); // Softness value between 0 and 1
    const colors = generateRandomColors(level);

    const style = {
        gradient: generateRandomGradient(colors, level),
        textGlow: generateGlow(colors)
    };

    let gradientType = style.gradient.toString().startsWith("radial-gradient") ? "radial" : "linear"

    const colorsCount = colors.length
    //const rarity = calculateFloatValue(colorsCount, softness, gradientType);
    const condition = getCondition(colorsCount, gradientType, style.textGlow);
    const rarity = calculateFloatModifier(condition, colorsCount, softness, style.textGlow);

    return { style, rarity, colorsCount, gradientType, softness };
}

async function generateTextDecorations(quantityConfig) {
    Object.entries(quantityConfig).forEach(async ([rarity, quantity]) => {
        for (let i = 0; i < quantity; i++) {
            const decoration = generateRandomTextDecoration(rarity);

            let paint = await db.paint.create({
                data: {
                    gradient: decoration.style.gradient,
                    glow: decoration.style.textGlow ?? null,
                    float: decoration.rarity,
                    level: rarity,
                    colorCount: decoration.colorsCount,
                    name: generate()
                }
            })

            console.log(paint.name, paint.level)
        }
    });

    return true
}

export async function createPaints() {
    const quantityConfig = {
        'Factory New': 1,
        'Field-Tested': 15,
        'Well-Worn': 15,
        'Battle-Scarred': 20
    };
    await generateTextDecorations(quantityConfig); // Generate new skins
    return true
}

export async function getPaints(count) {
    const itemCount = await db.paint.count();
    const skip = Math.max(0, Math.floor(Math.random() * itemCount) - count);

    let paints = await db.paint.findMany({
        take: count,
        skip: skip
    })

    return paints
}

export async function openPack(type) {
    switch (type) {
        case 'MASTER':
            {
                let pickLegend = Math.random() < 0.009 ? true : false;
                if (pickLegend) {
                    const itemCount = await db.paint.count({ where: { level: "Factory New" } });
                    const skip = Math.max(0, Math.floor(Math.random() * itemCount));
                    let paints = await db.paint.findMany({
                        where: {
                            level: "Factory New"
                        },
                        take: 1,
                        skip: skip
                    })
                    return paints
                } else {
                    const itemCount = await db.paint.count({ where: { level: "Field-Tested" } });
                    const skip = Math.max(0, Math.floor(Math.random() * itemCount));
                    let paints = await db.paint.findMany({
                        where: {
                            level: "Field-Tested"
                        },
                        take: Math.max(3, Math.floor(Math.random() * 5)),
                        skip: skip
                    })
                    return paints
                }
            }
            break;
        case 'EPIC':
            {
                const itemCount = await db.paint.count({
                    where: {
                        level: "Field-Tested"
                    }
                });
                const skip = Math.max(0, Math.floor(Math.random() * itemCount) - 3);

                let paints = await db.paint.findMany({
                    where: {
                        level: "Field-Tested"
                    },
                    take: Math.max(1, Math.floor(Math.random() * 4)),
                    skip: skip
                })

                return paints
            }
            break;
        case 'STARTER':
            {
                const itemCount = await db.paint.count({
                    where: {
                        OR: [
                            {
                                level: "Well-Worn"
                            },
                            {
                                level: "Battle-Scarred"
                            },
                        ],
                    }
                });
                const skip = Math.max(0, Math.floor(Math.random() * itemCount) - 2);

                let paints = await db.paint.findMany({
                    where: {
                        OR: [
                            {
                                level: "Well-Worn"
                            },
                            {
                                level: "Battle-Scarred"
                            },
                        ],
                    },
                    take: 3,
                    skip: skip
                })

                return paints
            }
            break;
        default:
            const itemCount = await db.paint.count({
                where: {
                    OR: [
                        {
                            level: "Well-Worn"
                        },
                        {
                            level: "Battle-Scarred"
                        },
                    ],
                }
            });
            const skip = Math.max(0, Math.floor(Math.random() * itemCount) - 2);

            let paints = await db.paint.findMany({
                where: {
                    OR: [
                        {
                            level: "Well-Worn"
                        },
                        {
                            level: "Battle-Scarred"
                        },
                    ],
                },
                take: 3,
                skip: skip
            })

            return paints

    }
}
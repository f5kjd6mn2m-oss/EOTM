const { z } = require('zod');

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Noto'g'ri ID");

const idParam = z.object({ id: objectId });

module.exports = { z, objectId, idParam };

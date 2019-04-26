module.exports = {
    friendlyName: 'Get viewer',

    description: 'Get a "viewer" model record. Will auto-update username if it changes (possible on Twitch anyway).',

    inputs: {
        user: {
            description: 'The plain username of the viewer running the command.',
            type: 'string',
            required: true
        },

        userId: {
            description: 'The platform-dependent user ID of the viewer running the command.',
            type: 'string',
            required: true
        },

        platform: {
            description: 'The platform that the command was issued from.',
            type: 'string',
            required: true
        },

        req: {
            description: 'The "req" object, so we can keep track of the viewer through the entire request (for logging).',
            type: 'ref',
            required: true
        }
    },

    exits: {
        success: {}
    },

    fn: async function (inputs, exits) {
        let viewer = await sails.models.viewer.findOne({userId: inputs.userId, platform: inputs.platform});

        if (!viewer) {
            viewer = await Viewer.create({userId: inputs.userId, name: inputs.user, platform: inputs.platform}).fetch();
        } else if (viewer && viewer.name !== inputs.user) {
            let temp = await Viewer.update({userId: inputs.userId, platform: inputs.platform}, {name: inputs.user}).fetch();
            viewer = temp[0];
        }

        inputs.req.viewer = viewer;

        return exits.success(viewer);
    }
};

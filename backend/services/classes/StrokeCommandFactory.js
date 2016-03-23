exports.StrokeCommand = (leftServoCommand, rightServoCommand, lifterServoCommand) => {
    return {
        leftServoCommand: leftServoCommand,
        rightServoCommand: rightServoCommand,
        lifterServoCommand: lifterServoCommand,
    };
};
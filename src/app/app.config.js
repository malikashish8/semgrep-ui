module.exports = {
    semgrepJsonFilePath: '/semgrep-out/99designs.json',
    baseGitlabPath: 'https://gitlab.com/vistaprint-org/',
    ignoredCheckIds: [
        'generic.secrets.security.detected-aws-account-id.detected-aws-account-id',
        'dockerfile.security.last-user-is-root.last-user-is-root'
    ],
    ignoredPathsContaining: [
        "dev",
        "test",
        "fixtures",
        "cli",
        "scripts"
    ],
    onlyErrorSeverity: true,
    impactMedOrHigher: true,
    likelihoodMedOrHigher: false
}
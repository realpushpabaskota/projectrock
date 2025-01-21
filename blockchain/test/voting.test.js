const OnlineVoting = artifacts.require("OnlineVoting");

contract("OnlineVoting", (accounts) => {
    const [admin, voter1, voter2] = accounts;

    beforeEach(async () => {
        this.contract = await OnlineVoting.new({ from: admin });
    });

    it("should add candidates correctly", async () => {
        await this.contract.addCandidate("Candidate 1", { from: admin });
        const candidate = await this.contract.candidates(1);
        assert.equal(candidate.name, "Candidate 1", "Candidate name mismatch");
    });

    it("should allow voting and tally votes", async () => {
        await this.contract.addCandidate("Candidate 1", { from: admin });
        await this.contract.registerVoter(voter1, { from: admin });
        await this.contract.startElection({ from: admin });

        await this.contract.vote(1, { from: voter1 });
        const candidate = await this.contract.candidates(1);
        assert.equal(candidate.voteCount, 1, "Vote count mismatch");
    });
});

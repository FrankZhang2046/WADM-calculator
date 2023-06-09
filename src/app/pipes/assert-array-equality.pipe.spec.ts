import { AssertArrayEqualityPipe } from "./assert-array-equality.pipe";

describe("AssertArrayEqualityPipe", () => {
    it("create an instance", () => {
        const pipe = new AssertArrayEqualityPipe();
        expect(pipe).toBeTruthy();
    });
});

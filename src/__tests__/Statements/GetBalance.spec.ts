import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;




describe("Get balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        getBalanceUseCase= new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
    })

    it ("shoul be able to get balance from a user", async () => {
        const { id } = await createUserUseCase.execute({
            name: "Franklin",
            email: "franklin@example.com",
            password: "202122",
        });

        const balance = await getBalanceUseCase.execute({ user_id: id as string });

        expect(balance).toHaveProperty("balance");
    })
});
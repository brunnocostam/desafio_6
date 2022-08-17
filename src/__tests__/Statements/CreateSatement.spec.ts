import { TableForeignKey } from "typeorm";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementeUseCase: CreateStatementUseCase;




describe("Get balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementeUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it ("Should be able to criate a deposit statement", async () => {
        const newUser = await createUserUseCase.execute({
            name: "Trevor",
            email: "trevor@example.com",
            password: "202122",
        });

        const newDeposit = {
            user_id: newUser.id,
            type: "deposit",
            amount: 100,
            description: "pix supermercado",
        };

        const statement = await createStatementeUseCase.execute(newDeposit as ICreateStatementDTO);
        expect(statement).toHaveProperty("id");
    });


    })
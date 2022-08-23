import { TableForeignKey } from "typeorm";
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../../modules/statements/useCases/createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "../../modules/statements/useCases/getBalance/GetBalanceUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;




describe("Get balance", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    });

    it ("Should be able to create a deposit statement", async () => {
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

        const statement = await createStatementUseCase.execute(newDeposit as ICreateStatementDTO);
        expect(statement).toHaveProperty("id");
    });

    it("Should be able to create a withdraw statement", async () => {
        const otherUser = await createUserUseCase.execute({
            name: "MikeToreno",
            email: "MikeToreno@cia.com",
            password: "iKnowWhereYouAre",
        });

        const firstDeposit = {
            user_id: otherUser.id,
            type: "deposit",
            amount: 500,
            description: "pix deposito",
        };

        const withdraw = {
            user_id: otherUser.id,
            type: "withdraw",
            amount: 100,
            description: "pix saque",
        };

        const depositStatement = await createStatementUseCase.execute(firstDeposit as ICreateStatementDTO);
        const withdrawStatement = await createStatementUseCase.execute(withdraw as ICreateStatementDTO);
        
        expect(depositStatement).toHaveProperty("id");
        expect(withdrawStatement).toHaveProperty("id");
    })

    it("Should not be able to create a withdraw statement because of insufficient funds", async () => {
        const otherUser = await createUserUseCase.execute({
            name: "Wu Zi Mu",
            email: "cantseathing@example.com",
            password: "aofidosafjoisdjf",
        });

        const withdraw = {
            user_id: otherUser.id,
            type: "withdraw",
            amount: 100,
            description: "pix supermercado",
        };

        await expect(
            createStatementUseCase.execute(withdraw as ICreateStatementDTO)
        ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    })


    it("Should not be able to create a statement for a non-existing user", async () => {
        const anotherUser = await createUserUseCase.execute({
            name: "The Truth",
            email: "HippieIsTheNewBlack",
            password: "BurnItAllCJ"
        })

        const wrongUserId = "980792039485"

        expect( async () => {
            const anotherDeposit = {
                user_id: wrongUserId,
                type: "deposit",
                amount: 300,
                description: "CJs new burning tool",
            }
    
            const newStatement = await createStatementUseCase.execute(anotherDeposit as ICreateStatementDTO);
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    })


    })
import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../modules/statements/useCases/createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationError";
import { GetStatementOperationUseCase } from "../../modules/statements/useCases/getStatementOperation/GetStatementOperationUseCase";
import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperation: GetStatementOperationUseCase;


describe("Get operation", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        getStatementOperation = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    })

    it("shoul be able to get the info from an operation", async () => {
        const newUser = await createUserUseCase.execute({
            name: "Carl Johnosn",
            email: "franklin@example.com",
            password: "202122",
        });

        const deposit = await createStatementUseCase.execute({
            user_id: newUser.id as string,
            type: 'deposit',
            amount: 500,
            description: "pix supermercado",
        } as ICreateStatementDTO);

        const operation = await getStatementOperation.execute({
            user_id: newUser.id as string,
            statement_id: deposit.id as string,
        })
        
        expect(operation.id).toEqual(deposit.id);
        expect(operation.user_id).toEqual(newUser.id);
    })

    it("Should not be able to get information about a non-existing user's operation", async () => {
        const anotherUser = await createUserUseCase.execute({
            name: "Melvin Harris",
            email: "mynameisbigsmoke@gmail.com",
            password: "EndOFTheLine",
        })

        const newDeposit = await createStatementUseCase.execute({
            user_id: anotherUser.id as string,
            type: 'deposit',
            amount: 500,
            description: "pix supermercado",
        } as ICreateStatementDTO);

        const wrongDepositId = "18192021" as string;
        const wrongUserId =  "21201918";

        expect(async () => {
            const op = await getStatementOperation.execute({
                user_id: wrongUserId,
                statement_id: newDeposit.id as string,
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    })

    it("Should not be able to get information about a non-existing operation", async () => {
        const otherUser = await createUserUseCase.execute({
            name: "Frank Tempenny",
            email: "agenttempenny@gmail.com",
            password: "ImmaScrewCJ",
        })

        const oneMoreDeposit = await createStatementUseCase.execute({
            user_id: otherUser.id as string,
            type: 'deposit',
            amount: 500,
            description: "pix supermercado",
        } as ICreateStatementDTO);

        const wrongStatementId = "18192021" as string;
        const wrongUserId =  "21201918";

        expect(async () => {
            const op = await getStatementOperation.execute({
                user_id: otherUser.id as string,
                statement_id: wrongStatementId,
            })
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    })

    



});
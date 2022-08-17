import { InMemoryStatementsRepository } from "../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../../modules/statements/useCases/createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../../modules/statements/useCases/createStatement/ICreateStatementDTO";
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

    it ("shoul be able to get the info from an operation", async () => {
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

        console.log(operation);
        
        expect(operation.id).toEqual(deposit.id);
        expect(operation.user_id).toEqual(newUser.id);

    })
});
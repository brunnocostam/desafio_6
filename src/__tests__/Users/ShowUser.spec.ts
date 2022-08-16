import { InMemoryUsersRepository } from "../../modules/users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../modules/users/useCases/authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../modules/users/useCases/createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../../modules/users/useCases/showUserProfile/ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUsecase: CreateUserUseCase;
let authenticateUserUsecase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show users", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUsecase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("should be able to show a user profile", async () => {
        const newUser = {
            name: "Mike",
            email: "mike@example.com",
            password: "123456",
        }

        const {id, email} = await createUserUsecase.execute(newUser);
        const userProfile = await showUserProfileUseCase.execute(id as string);
        const authProfile = await authenticateUserUsecase.execute({
            email: newUser.email,
            password: newUser.password
        })

        expect(userProfile).toHaveProperty("id");
        expect(userProfile.name).toEqual(authProfile.user.name);
        expect(authProfile.token).toBeDefined();
        expect(authProfile.user.id).toEqual(id)

    });
});